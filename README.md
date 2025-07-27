# 🕵️ SceneSolver - Crime Video Analysis AI

SceneSolver is an AI-powered crime video analysis tool that uses:

- 🧠 **CLIP** for zero-shot crime classification  
- 📋 **Evidence labeling** for frame-wise insights  
- ✍️ **BART** for auto-generating story summaries  
- 🎞️ Frame extraction from videos  
- 🌐 Full-stack integration using **Flask (backend)** and **React (frontend)**

---

## 🧪 Features

✅ Upload any CCTV/crime video  
✅ Extract representative frames  
✅ Classify crime type (robbery, explosion, fighting, etc.)  
✅ Identify fine-grained visual evidence  
✅ Generate a summary story of the scene  

---

## 📦 Folder Structure

```text
scenesolver/
├── backend/                  # Flask backend with CLIP + BART pipeline
│   └── app.py                # Main backend app
├── frontend/                 # React frontend
│   └── src/pages/ToolPage.jsx
├── best_model.pth           # Fine-tuned CLIP model weights
├── generalized_captions_general.txt  # Caption list for BLIP/CLIP
├── train_model.ipynb        # Model training notebook
├── frames/                  # Extracted video frames (auto-generated)
├── README.md
└── .gitignore
