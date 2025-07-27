import React, { useState, useRef } from 'react';
import axios from 'axios';

function ToolPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [currentFact, setCurrentFact] = useState('');
  const fileInputRef = useRef();

  const crimeFacts = [
    "India has over 25,000 reported cybercrime cases each year.",
    "Most crimes are committed by repeat offenders.",
    "AI is being used to predict crimes before they happen.",
    "Delhi has the highest number of reported crimes in India.",
    "Facial recognition is becoming crucial in crime solving.",
    "Crimes are more likely to occur at night.",
    "Theft is the most commonly reported crime worldwide.",
    "Video analysis reduces investigation time by 80%.",
    "Real-time CCTV crime detection is now possible with AI.",
    "Most crimes are solved within the first 48 hours."
  ];

  useEffect(() => {
    let index = 0;
    setCurrentFact(crimeFacts[0]);
    const interval = setInterval(() => {
      index = (index + 1) % crimeFacts.length;
      setCurrentFact(crimeFacts[index]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFile = (file) => {
    setUploadedFile(file);
    const fileType = file.type;
    const fileURL = URL.createObjectURL(file);

    if (fileType.startsWith('image/')) {
      setIsVideo(false);
    } else if (fileType.startsWith('video/')) {
      setIsVideo(true);
    } else {
      alert('Please upload an image or video file.');
      setUploadedFile(null);
      return;
    }
    setPreviewUrl(fileURL);
    setResults(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const analyzeFile = async () => {
    if (!uploadedFile) {
      alert('Please upload a file first before analyzing.');
      return;
    }

    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append('media', uploadedFile);

    try {
      const res = await axios.post('http://127.0.0.1:5000/analyze', formData);
      console.log('✅ Received from backend:', res.data);
      setResults(res.data);
    } catch (error) {
      console.error('❌ Error analyzing media:', error);
      alert('An error occurred during analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene_analysis_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to right, #1f1c2c, #928dab);
          font-family: 'Inter', sans-serif;
        }

        .analysis-container {
          max-width: 900px;
          margin: 50px auto;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          text-align: center;
        }

        .file-upload-area {
          border: 2px dashed rgba(255, 255, 255, 0.4);
          padding: 40px;
          border-radius: 16px;
          cursor: pointer;
          min-height: 350px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: background 0.3s, border-color 0.3s;
        }

        .file-upload-area:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #a41bd1;
        }

        #analyze-button {
          background-color: #a41bd1;
          color: white;
          padding: 14px 40px;
          border: none;
          border-radius: 9999px;
          font-size: 1.3em;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          box-shadow: 0 0 10px rgba(164, 27, 209, 0.5);
          transition: 0.3s ease;
        }

        #analyze-button:hover {
          background-color: #8912b7;
          transform: scale(1.05);
        }

        .video-preview-wrapper {
          width: 100%;
          position: relative;
          padding-top: 56.25%;
          margin-top: 15px;
          border-radius: 5px;
          overflow: hidden;
        }

        .video-preview-wrapper video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .spinner {
          border: 5px solid rgba(255, 255, 255, 0.2);
          border-top: 5px solid #a41bd1;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .results-area {
          margin-top: 40px;
          text-align: left;
        }

        .results-area p {
          font-size: 1.1em;
          line-height: 1.6;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .download-btn {
          margin-top: 1rem;
          padding: 10px 24px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .download-btn:hover {
          background-color: #0061cc;
        }

        .fact-box {
          background: rgba(255, 255, 255, 0.07);
          padding: 20px;
          border-radius: 10px;
          margin-top: 30px;
          font-size: 1.1em;
          line-height: 1.6;
          color: #f1f1f1;
        }
      `}</style>

      <div className="analysis-container">
        <h2>Analyze Your Crime Scene</h2>

        <div
          className="file-upload-area"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <p>Drag & Drop your image or video here, or click to browse</p>

          {!isVideo && previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxHeight: '300px', marginTop: '15px', borderRadius: '5px' }}
            />
          )}

          {isVideo && previewUrl && (
            <div className="video-preview-wrapper">
              <video src={previewUrl} controls />
            </div>
          )}
        </div>

        <button id="analyze-button" onClick={analyzeFile}>
          🔍 Analyze Scene
        </button>

        {loading && <div className="spinner" />}

        {results && (
          <div className="results-area">
            <h3 style={{ fontSize: '2em', marginBottom: '20px', color: '#e6d7f6' }}>
              Analysis Results:
            </h3>
            {results.crime && <p>🕵️ <strong>Crime Type Detected:</strong> {results.crime}</p>}
            {results.evidence && <p>🔍 <strong>Evidence Found:</strong> {results.evidence.join(', ')}</p>}
            {results.final_summary && (
              <p>📖 <strong>Scene Summary:</strong><br />{results.final_summary}</p>
            )}
            <button className="download-btn" onClick={downloadReport}>
              📥 Download Report
            </button>
          </div>
        )}

        <div className="fact-box">
          <strong>🧠 Crime Fact:</strong><br />
          {currentFact}
        </div>
      </div>
    </>
  );
}

export default ToolPage;
