# System Design Decisions & Tradeoffs

The development of SceneSolver involves continuous arbitration between technical complexity, hardware requirements, and end-user accuracy. The design implemented attempts to minimize architectural orchestration in favor of demonstrating an operational AI stack leveraging Zero-Shot inferencing.

## 1. Zero-Shot Inferencing vs Fine-Tuning

**Decision**: The visual recognition layer relies entirely on Contrastive Language-Image Pretraining (CLIP) operating in a zero-shot capacity driven explicitly by passing complex strings of text (e.g., `crime_labels`) directly to the model at inference time, compared against a fine-tuned categorical Image Classifier.

*   **Tradeoffs**:
    *   **Pro (Agility)**: Adding a new evidence label (e.g., detecting "crowbars") takes literally zero code changes beyond updating a python array listing. There is no retraining, pipeline rebuilding, or epoch monitoring.
    *   **Con (Accuracy Loss)**: Zero-shot transformers fail spectacularly at complex, localized object detection. CLIP excels at classifying an entire image ("A cat on a mat"), but struggles significantly to detect small pixel anomalies like "Bullet casing" inside a large resolution CCTV frame.
    *   **Con (Compute Complexity)**: Passing an array of 50+ localized evidence titles requires dynamic matrix multiplication embedding against the image for all 50 items simultaneously on every frame. A traditional classifier outputting a boolean node is vastly more efficient computationally.

## 2. Integrated Backend vs Separated AI Microservices

**Decision**: The entire AI inference pipeline rests within a single Python synchronous Flask monolithic file (`app.py` & `pipeline.py`).

*   **Tradeoffs**:
    *   **Pro (Simplicity)**: Development workflows are minimized.
    *   **Con (Scalability limits)**: By combining the REST API gateway serving the frontend with the GPU-locked inferencing engine, scaling horizontally is fundamentally impossible. Adding a second server doubles the API load balancers *and* doubles the massive GPU requirements, instead of letting a cheap EC2 instance handle REST HTTP holding queues while distributing workloads to a centralized GPU broker queue like Celery+Redis.
    *   **Con (Synchronous Latency)**: An HTTP request simply blocks until the GPU finishes processing all 30 frames and generation completes.

## 3. Frame Subsamping Configuration

**Decision**: Video extraction statically drops 95%-99% of structural video data by capping extraction down to 1 Frame-Per-Second (FPS), maxing out at 30 bounds.

*   **Tradeoffs**:
    *   **Pro (Feasibility)**: Without capping, running a localized CLIP inference against 300 FPS from a mere 10-second security video would crash most Consumer grade VRAM arrays immediately.
    *   **Con (Context Eradication)**: High speed incidents (such as an explosive shockwave, or a split-second altercation) might occur entirely between the 1000ms gap, yielding absolutely zero evidence in the output model. The system prioritizes processing viability over high-fidelity accuracy.

## 4. Why Use HuggingFace BART for Narration?

*The system uses BART (facebook/bart-large-cnn) specifically rather than simpler summarization pipelines.*

*   **Reasoning**: SceneSolver required *Abstractive Summarization* rather than *Extractive Summarization*.
*   *Extractive algorithms* simply string together the 30 independent captions. The narration would literally read: `"An empty room. An empty room. A man walking. A man walking. A man grabbing an object."` This is unreadable and unhelpful for a forensic investigator.
*   *Abstractive algorithms* (like BART) evaluate the semantics of those descriptions and conceptually rewrite the sequence into logic. "An initially empty room was breached by a man walking who subsequently grabbed an object." The narrative compression provided by models like BART outweighs the severe VRAM imposition required to load the model locally.

## Improvements for Production Environments

If migrating to an enterprise setting, the following architecture pivots would be prioritized:

1.  **Queue-Based Worker Design** (Crucial): Severing the Flask UI API layer from the `pipeline.py` using asynchronous brokers like Celery or Apache Kafka allows user web streams to drop videos off immediately, disconnect HTTP channels, and let worker GPUs pick up jobs as they become available.
2.  **YOLO Integration for Evidence**: Replacing zero-shot arrays for specific pieces of evidence. Implement YOLO (You Only Look Once) bounding box detection for specific localized entities like 'guns', 'masks', and 'money', relegating CLIP back strictly to global scene analysis ("is this a robbery or a fire?").
3.  **Local State Elimination**: Wiping utilization of local `uploads/` directories. Streaming media directly to transient blobs stored in AWS S3 or Azure directly, with Python retrieving signed SAS URLs for remote loading.
