from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pipeline import analyze_media

app = Flask(__name__)
CORS(app)  # enable CORS so React can talk to Flask

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'media' not in request.files:
        return jsonify({'error': 'No media uploaded'}), 400

    file = request.files['media']

    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        result = analyze_media(file_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
