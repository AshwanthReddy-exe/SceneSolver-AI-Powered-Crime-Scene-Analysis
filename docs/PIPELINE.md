# SceneSolver AI Pipeline Details

The SceneSolver AI pipeline coordinates sequential vision-language operations across raw media to produce actionable forensic insights. It is fundamentally a zero-shot retrieval pipeline coupled with abstractive summarization.

## Pipeline Initialization

1.  **Hardware Assessment**: The pipeline evaluates whether a GPU (`cuda`) is available. If available, tensor operations are routed to the GPU; otherwise, it falls back to the CPU.
2.  **Model Instantiation**:
    *   **CLIP (openai/clip-vit-base-patch32)**: Initialized via Hugging Face. The pipeline subsequently dynamically overlays custom weights via `best_model.pth` using Python's `torch.load()`. Strict type matching during the state dictionary load is set to `False` (`strict=False`), allowing partial modifications to the model architecture.
    *   **BART Summarizer (facebook/bart-large-cnn)**: Loaded dynamically inside the `summarize_captions` method.
3.  **Vocabulary Load**: The massive caption corpus (`generalized_captions_generalized.txt`) is read from disk into memory as an array of textual strings.

---

## 1. Input Processing & Frame Extraction

When media enters the pipeline (`analyze_media()`), Python's `mimetypes` library determines the processing fork.

**Image Fork**: Sent directly to classification. Preprocessed automatically by CLIP's integrated vision transforms.

**Video Fork**:
*   The system wipes any previously analyzed frames inside the `frames/` local cache.
*   **Decimation Algorithm**: Utilizing OpenCV `cvVideoCapture`, the system reads the original framerate. It extracts exactly 1 frame per second (`fps=1`).
*   **Limiter**: To govern compute usage, the extraction breaks early once `saved >= 30`. Therefore, videos longer than 30 seconds are analytically truncated.

---

## 2. Zero-Shot Inference Engine (CLIP)

Scene analysis relies critically on the capabilities of Contrastive Language-Image Pretraining (CLIP) to identify semantic concepts without specialized bounding box or categorical retraining. For every image or extracted frame:

1.  **Preparation**: The image passes through the `CLIPProcessor`, converting raw pixel data into standardized, normalized tensor spaces acceptable by the ViT.
2.  **Forward Pass**: The visual tensor is fed into the loaded CLIP model alongside three sets of tokenized text.
    *   **Task 1: Crime Classification**. The image is compared simultaneously against the 6 `crime_labels`. Softmax transforms the logits into probabilities. The Top-1 probability is retrieved.
    *   **Task 2: Evidence Mining**. The image is compared simultaneously against the 88 localized `evidence_labels` (e.g., Blood, Weapons, Actions). The Top-3 probabilities are retrieved.
    *   **Task 3: Scene Contextualization**. The image is mapped against the entire `generalized_captions` array. A hard max (`argmax`) is used to retrieve the single textual caption string most closely representing the image frame.

---

## 3. Summarization Algorithm (BART)

Once CLIP provides localized semantic maps of the frames, SceneSolver synthesizes the findings.

1.  **Input Construction**: For images, this is a single string. For videos, this is the concatenation of the 30 independent caption strings extracted during the Zero-Shot Engine phase.
    *   *Algorithm Detail*: Prior to concatenation, the array of captions is passed through a Python `set()`. This acts as a rudimentary deduplication mechanism, preventing BART from hallucinating based on highly repetitive frames (e.g., a locked CCTV camera pointing at an empty street).
2.  **Text Generation**: The deduplicated text is tokenized (capped at 1024 tokens) and pushed through `BartForConditionalGeneration`.
3.  **Beam Search**: Generation utilizes a 4-path beam search (`num_beams=4`) with early stopping, forcing the output to a length bounds rigidly between 100 and 500 tokens.

---

## 4. Multi-Frame Aggregation (Voting Mechanism)

For video ingestion, data retrieved individually from the 30 frames must be flattened into a single API response. SceneSolver relies on simple frequency counters (Python `collections.Counter`).

*   **Crime Type**: Uses absolute majority logic. The single label with the highest vote count across all 30 frames "wins" the classification.
*   **Evidence List**: Uses frequency distribution. The top 10 most frequently detected elements of evidence (irrespective of their frame probability confidence) are flattened into the final array.
*   **Narrative**: Managed directly by BART consuming the deduplicated list of captions as denoted above.

---

## Pipeline Limitations & Tradeoffs

*   **Absence of Temporal Awareness**: The system treats video frames as unrelated, independent images. It cannot detect momentum, sequence of events (e.g., Person A pushing Person B), or chronological progression.
*   **Hard Truncation**: Capping frame extraction at 30 seconds introduces a severe risk of missing crucial evidence if an incident occurs after the 30-second mark of a surveillance video.
*   **Resource Intensity**: Loading `BART-large` dynamically inside the summarization function (rather than loading it globally into memory like the CLIP model) introduces massive latency hits and potential GPU memory fragmentation per request.
*   **Zero-Shot Reliability**: Evidence detection is completely reliant on CLIP embeddings; small, granular evidence that spans only a few pixels (like shell casings) regularly falls below the noise floor of standard Vision Transformers without specific Object Detection architectures (e.g., YOLO).
