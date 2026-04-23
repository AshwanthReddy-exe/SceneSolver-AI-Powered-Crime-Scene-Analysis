# SceneSolver – AI-Powered Crime Scene Analysis System

## Overview
SceneSolver is an automated video and image analysis system designed to categorize and extract forensic evidence from raw surveillance footage. It replaces manual video review workflows with a scalable, locally-run Visual-Language Model (VLM) pipeline. 

By analyzing media files, it identifies specific crime typologies via zero-shot semantic matching, logs granular visual evidence (e.g., weapons, shattered glass, blood), and synthesizes these data points into a cohesive, abstractive narrative report.

## How It Works
1. **Ingestion**: Raw media (videos or images) is securely uploaded via the React dashboard through a unified REST API endpoint.
2. **Preprocessing**: For videos, OpenCV executes a decimated extraction algorithm (1 frame-per-second, capped at 30 bounds) to normalize tensor representations and prevent GPU memory overflow.
3. **Zero-Shot Inference**: Each frame is pipelined through OpenAI's CLIP model. Rather than relying on rigid bounding boxes, CLIP embeddings calculate the highest probability semantic matches against configured arrays of text identifiers.
4. **Abstractive Synthesis**: Visual captions derived from all processed frames are deduplicated and fed into a BART Large CNN model. BART synthesizes the separate visual cues into a singular logical narrative summary.

## Key Features
- **Zero-Shot Scene Analysis**: Classifies scenes dynamically without relying on fine-tuned categorical retraining.
- **Automated Video Decimation**: Gracefully subsets highly dense video data to fit within viable computing limits.
- **Semantic Evidence Extraction**: Identifies exact events alongside highly specific visual assets seamlessly.
- **Synchronous AI Integration**: Bridges heavy PyTorch inference algorithms directly to web clients.
- **Interactive Forensic Dashboard**: Provides immediate visual ingestion UX and exports downloadable JSON incident reports.

## Tech Stack
- **Frontend**: React, Axios
- **Backend API**: Python, Flask
- **AI Core**: PyTorch, HuggingFace Transformers, CLIP (OpenAI), BART (Facebook)
- **Computer Vision & Processing**: OpenCV, PIL (Python Imaging Library)

## System Architecture
SceneSolver operates through a strictly decoupled frontend-backend architecture. A Flask container orchestrates HTTP routing and transient storage, subsequently piping validated data entirely into an encapsulated PyTorch tensor processing pipeline.

👉 [See detailed architecture: docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Demo & Usage
```bash
# 1. Start the Flask AI Backend
cd backend
python app.py # Initializes the inference REST endpoint on port 5000

# 2. Start the React Frontend UI
cd frontend
npm install
npm start # Launches dashboard at localhost:3000
```

## Documentation
- Architecture → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Pipeline → [docs/PIPELINE.md](docs/PIPELINE.md)
- Backend → [docs/BACKEND_DESIGN.md](docs/BACKEND_DESIGN.md)
- Frontend → [docs/FRONTEND_INTERACTION.md](docs/FRONTEND_INTERACTION.md)
- Design Decisions → [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)
- Scalability → [docs/SCALABILITY_AND_LIMITATIONS.md](docs/SCALABILITY_AND_LIMITATIONS.md)

## Design Highlights
- **Why CLIP:** Utilizing Contrastive Language-Image Pretraining (CLIP) eliminates brittle, time-consuming YOLO bounding-box fine-tuning. Tracking a new item of evidence fundamentally requires only updating a text string in the configuration array block.
- **Handling Video Data:** To maintain hardware viability on consumer-grade GPU VRAM, OpenCV arrays deliberately drop 95%+ of structural video data (decimating down to 1 FPS) and truncating inference strictly after 30 segments.
- **Accuracy vs. Latency Tradeoffs:** Processing deduplicated text arrays through an LLM (BART) dramatically increases the forensic output's human readability but introduces massive latency bottlenecks compared to simple string joining.
- **Service Decoupling:** The distinct web layer API prepares the system to easily migrate off synchronous endpoint blocking and into an asynchronous messaging queue (e.g., Celery/RabbitMQ) broker deployment.
