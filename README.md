# SceneSolver – AI-Powered Crime Scene Analysis System

## Overview
SceneSolver is an automated video and image analysis system designed to categorize and extract forensic evidence from raw surveillance footage. It replaces manual video review workflows with a scalable, locally-run Visual-Language Model (VLM) pipeline. 

By analyzing media files, it identifies specific crime typologies via zero-shot semantic matching, logs granular visual evidence, and synthesizes these data points into a cohesive narrative report.

## How It Works
1. **Frontend (React)**: Users upload media through the React dashboard on port 3000.
2. **Auth Backend (Node.js/Express)**: Handles Login and Sign-Up requests, connecting to MongoDB, running on port 8080.
3. **AI Backend (Python/Flask)**: Handles Heavy AI Processing (`/analyze`), loading Torch models to generate insights, running on port 5000.

---

## 🚀 Environment Setup & Run Instructions

To successfully run SceneSolver on your local machine, you must run all three components in separate terminal windows.

### Prerequisites
- [Node.js](https://nodejs.org/en) installed (for Frontend and Node Auth Backend)
- [Python 3.9+](https://www.python.org/downloads/) installed (for AI Backend)
- [MongoDB URI](https://www.mongodb.com/) (for User Auth)

### 1. Configure the Environment
1. Copy `.env.example` to `backend/.env`
2. Open `backend/.env` and update `MONGO_CONN` with your MongoDB connection string.
3. Make sure to download or place `best_model.pth` in the root folder of this project (if using a custom fine-tuned model), otherwise it will fall back to zero-shot generic CLIP.

### 2. Start the Auth Server (Node.js)
Open a new terminal and run:
```bash
cd backend
npm install
npm start
```
*Runs on port: `8080`*

### 3. Start the AI Server (Python/Flask)
Open a second terminal and run:
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask AI API
python app.py
```
*Runs on port: `5000`*

### 4. Start the Frontend App (React)
Open a third terminal and run:
```bash
cd frontend
npm install
npm start
```
*Runs on port: `3000`. The browser will open the dashboard automatically.*

---

## 📡 Ports and Services

| Service | Technology | Port | Description |
|---|---|---|---|
| Frontend UI | React.js | `3000` | User dashboard (`/dashboard`), Auth pages |
| Auth Backend | Node.js (Express) | `8080` | Handles `/auth/login` and `/auth/signup` |
| AI Backend | Python (Flask) | `5000` | Analyzes media and generates reports |

---

## 🛠️ Troubleshooting

- **"Address already in use" Error:** If a port (e.g. 5000) is being used by another app (like macOS AirPlay Receiver), free the port or change the default Flask port in `backend/app.py`.
- **Database Connection Error:** Verify your `MONGO_CONN` string in `backend/.env`. Wait for MongoDB IP Whitelisting if necessary.
- **Missing `best_model.pth` Error:** If the custom model file is missing, the backend will safely fallback to the baseline OpenAI CLIP model. Ensure `generalized_captions_generalized.txt` is located in the root of the repository as expected.
- **Python Install Errors on Windows/Mac:** Ensure you have CMake or Visual Studio Build tools if `opencv-python` fails to compile. Pre-built wheels are usually pulled via `pip install`. 

---

## Documentation
- Architecture → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Pipeline → [docs/PIPELINE.md](docs/PIPELINE.md)
- Backend → [docs/BACKEND_DESIGN.md](docs/BACKEND_DESIGN.md)
- Frontend → [docs/FRONTEND_INTERACTION.md](docs/FRONTEND_INTERACTION.md)
- Design Decisions → [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)
- Scalability → [docs/SCALABILITY_AND_LIMITATIONS.md](docs/SCALABILITY_AND_LIMITATIONS.md)
