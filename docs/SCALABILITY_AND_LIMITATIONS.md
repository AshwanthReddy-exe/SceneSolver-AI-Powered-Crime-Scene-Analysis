# Scalability and System Limitations

The current SceneSolver architecture represents a functional prototype geared toward demonstrating analytical capability rather than providing enterprise-grade availability. Scaling this prototype to handle massive video datasets or concurrent user requests requires addressing critical bottlenecks inherently coded into the current implementation.

## Primary System Bottlenecks

1.  **Monolithic Synchronous I/O**:
    *   **The Issue**: The Flask server utilizes synchronous execution models. An HTTP POST request blocks the associated worker thread for the exact duration of the AI processing (often spanning from seconds to minutes).
    *   **Impact**: During synchronous blocking, that specific Python web worker cannot accept any other requests. Handling more than a few concurrent users instantly exhausts Web Server Gateway Interface (WSGI) thread pools, creating cascading `504 Gateway Timeout` errors for all subsequent connecting clients.

2.  **GPU Memory (VRAM) Fragmentation**:
    *   **The Issue**: Complex PyTorch architectures statically reserve VRAM. CLIP and BART models run back-to-back in `pipeline.py`.
    *   **Impact**: When running concurrently, two users hitting the `/analyze` endpoint simultaneously will force PyTorch to attempt double-instantiating massive ViT arrays and BART pipelines, usually causing instantaneous out-of-memory (OOM) `CUDA C++` exceptions crashing the server entirely.

3.  **Local Ephemeral Storage Dependencies**:
    *   **The Issue**: Frames extracted via `opencv-python` are dumped onto the local filesystem under `frames/` or `uploads/` without concurrent user collision prevention (e.g., using UUIDs per request).
    *   **Impact**: If User A uploads `robbery.mp4` and User B uploads `explosion.mp4` at the exact same moment, OpenCV will write `frame_001.jpg` from BOTH videos into the same localized `frames/` structure. This cross-contamination means User A's AI pipeline will analyze frames from User B's video arbitrarily resulting in entirely fabricated narratives.

## Constraints in the Analytical Model

Beyond computational scalability constraints, the AI functionality possesses algorithmic limitations:

*   **Absence of Temporal Vectoring**: Inference operates strictly on a frame-by-frame (`.jpg`) basis. It aggregates frequency over 30 independent frames. Thus, SceneSolver cannot detect chronological relationships. A video of a person dropping a weapon, vs picking up a weapon, relies solely on static visual embedding correlations instead of temporal flow (usually handled by 3D ResNet or TimeSformer models).
*   **Arbitrary Data Truncation**: Extraction loops artificially terminate at `max_frames=30`. Any event occurring past the initial 30 frames analyzed will be silently ignored.
*   **Resolution Dependencies**: CLIP dynamically rescales CCTV/investigational video down to `(224x224)`. Highly granular, mission-critical evidence (e.g., a specific tattoo, license plate, or small knife) falls victim to interpolation blur long before the visual transformer attempts tokenizing the region.

## Strategies for Production Scaling

A production-ready redesign would fundamentally rip apart the tight coupling between the Web REST server and the GPU Inference code:

1.  **Asynchronous Separation (Broker Pattern)**:
    *   Introduce **Redis/RabbitMQ**: Web UI posts HTTP to an API Server. The API uploads binary to Cloud Storage and issues an Event ID containing the blob location into a Redis queue.
    *   Initialize **Worker Nodes**: Fleet of GPU instances running Python listen to the queue. They pull the Event ID, process strictly asynchronously, and post the output JSON into a Database.
    *   **Frontend Polling/WebSockets**: UI polls an API `GET /status/{eventId}` to receive the database response when available.
2.  **Batch Vectorization**:
    Instead of running inference `for frame in tqdm(frame_paths):` (a slow, sequential python loop), the pipeline should construct massive `(30, 3, 224, 224)` Batched Tensors, passing all 30 video frames through the ViT hardware simultaneously leveraging modern GPU multithreading architecture.
3.  **S3/Blob Storage Segregation**:
    Strip all `os.path.join` and `cv2.imwrite` commands relying on generic `/uploads` folders and pivot to uniquely segregated transient blobs.
