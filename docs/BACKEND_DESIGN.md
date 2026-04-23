# Backend Design & Integration

The backend is built around a lightweight Python Flask application acting as the mediator between REST clients requesting analysis and the synchronous PyTorch processing pipeline. It utilizes basic local-disk I/O as its primary transit strategy for media payloads.

## API Endpoint Design

The system primarily relies on a single endpoint handling the computationally heavy lifing.

### Expected Request
**Endpoint**: `POST /analyze`
**Headers**: `multipart/form-data`
**Parameters**:
  *   `media`: The raw binary data of the file (Image or Video)

### Route Lifecycle

1.  **Validation**: A fast failure mechanism checks ensuring the `media` key is included in the form structure and that the filename is not empty (ensuring an actual file was transmitted). If invalid, a `400 Bad Request` is returned.
2.  **Disk Storage**:
    *   The `uploads` folder is verified/created.
    *   The file is transferred from the HTTP stream and written synchronously to `uploads/[filename]`.
3.  **Pipeline Submission**: The localized path (`/uploads/video.mp4`) is dispatched recursively down through deep inference chains terminating within PyTorch space in `pipeline.py`.
4.  **Exceptions Handling**: `try/except` wraps the analytical execution. Any failure returns `500 Internal Server Error`, stringifying the python exception without obfuscation.

### Standard Response Payload
Upon successful completion, a `200 OK` is returned containing the aggregated analysis details formatted as structured JSON:

```json
{
  "crime": "robbery",
  "evidence": ["Gunman", "Broken windows", "Masked"],
  "final_summary": "A masked individual enters holding an object resembling a handgun, pointing it aggressively resulting in broken windows. Debris and scattered fragments are visible marking a rapid exit."
}
```

## Data Transformations

Data transforms substantially between entering the API and generating a response.

1.  **Binary → Bytes**: Incoming HTTP stream is piped directly into file blobs using `file.save()` on the Werkzeug wrapper.
2.  **Bytes → Frames**: Handled by OpenCV's `VideoCapture`, turning the `.mp4` binary into a folder of `.jpg` structures.
3.  **Frames → Tensors**: The `CLIPProcessor` interprets `.jpg` arrays into `FloatTensor` structures representing raw RGB array transformations, reshaping into `(1, 3, 224, 224)` bounds required by standard ViTs and loading it into VRAM (`to(device)`).
4.  **Tensors → Probabilities**: Torch inference models perform a dot-product multiplication. Outputs from CLIP (Vectors `(1, 512)`) are processed via `softmax(dim=1)` arrays to normalize outputs between absolute values of 0.0 and 1.0 representing percentage confidences.
5.  **Probabilities → Categories**: Python logic strips values and maintains Top-K categorical strings using `torch.argmax()` and `Counter()` maps.
6.  **Categories → JSON**: Serialized natively by Flask's `jsonify`.

## Limitations in Design

Currently, the AI backend represents an un-optimized conceptual iteration with numerous implementation flaws:

*   **Synchronous Blocking**: The `/analyze` endpoint blocks the main thread for the duration of model execution. Transcribing videos blocks HTTP connections for minutes, eventually causing browser or proxy connection timeout limits to sever the connection.
*   **Memory Leaks/Inconsistencies**: Loading the massive `BART-large-cnn` model directly *inside* the `summarize_captions()` method means it is dynamically loading into GPU memory per-call and theoretically failing to trigger garbage collection properly, compounding VRAM limitations.
*   **Absolute Path Dependencies**: `pipeline.py` statically declares absolute paths to system-local instances like `model_path = "/Users/preetham_aleti/Desktop/scenesolver/best_model.pth"`. This breaks portability severely.
*   **No Clean Up**: The system never utilizes Python's `os.remove` or temporary abstractions `tempfile` to clean up the `uploads/` directory after inference completes. Over time, the server disk will hit out-of-storage exceptions.
