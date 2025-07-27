import os
import torch
from torchvision import transforms
from PIL import Image
from collections import Counter
from transformers import CLIPProcessor, CLIPModel, BartTokenizer, BartForConditionalGeneration
import cv2
from tqdm import tqdm
import json
import mimetypes

# CONFIG
model_path = "/Users/preetham_aleti/Desktop/scenesolver/best_model.pth"
frames_dir = "frames"
device = "cuda" if torch.cuda.is_available() else "cpu"

crime_labels = [
    "robbery", "explosion", "shoplifting",
    "shooting", "fight", "normal action"
]

evidence_labels = [
    "Fire", "Spread", "Explosion", "Intensity", "Catches", "Flames", "Smoke", "Blast", "Plume",
    "Expanding", "Bright", "Aftermath", "Damage", "Evacuating", "Debris", "Shockwave", "Scorch marks",
    "Crater", "Fragmentation", "Collapsed structure", "Burnt vehicles", "Broken windows",
    "Charred", "Rubble", "Displaced objects", "Secondary fires", "Shrapnel", "Scattered fragments",
    "Shattered glass", "Fireball", "Mushroom cloud", "Heatwave", "Ground vibration",
    "Severe structural damage", "Blown-out windows",

        "Collide", "Swing", "Stumbles", "Lifts", "Push", "Drags", "Exchange", "Dodges", "Kicks",
    "Resist", "Grapple", "Swings", "Break", "Surges", "Sprawling", "Falls", "Crashes", "Escalates",
    "Grabs", "Collapse", "Scuffle", "Punches", "Hits", "Slaps", "Throws", "Wrestles", "Strikes",
    "Headlock", "Tackle", "Pulling hair", "Choke", "Knockdown", "Punch exchange", "Blow", "Counter",
    "Block", "Uppercut", "Jab", "Kick to body", "Ground struggle", "Brawl", "Melee", "Beat",
         "Threatening", "Handgun", "Grabs", "Shoots", "Point", "Aimed", "Shouting", "Stolen",
    "Hoodie", "Demands", "Gunman", "Demand", "Collecting", "Drags", "Approaches", "Pulls",
    "Reaches", "Holding", "Restraining", "Steps", "Exits", "Escapes", "Helmeted", "Masked",
    "Observing", "Plotting", "Knife", "Bag of cash", "Cash register", "Loot", "Hostage",
    "Forced", "Intimidate", "Cash", "Jewelry", "Smash", "Threat", "Hands up",
    "Covering face", "Break-in", "Smash-and-grab", "Looting", "Fleeing", "Tied up", "Blindfold",
         "Swing", "Stumbles", "Lifts", "Struggle", "Aggressive", "Violence", "Dodges", "Kicks", "Push",
    "Grapple", "Swings", "Sprawling", "Bleeding", "Crashes", "Escalates", "Grabs", "Tackled",
    "Restrains", "Bottle", "Brawl", "Locked", "Strikes", "Punch", "Struck", "Blocked", "Kick",
    "Hitting", "Thrown", "Choke", "Headlock", "Slapped", "Punched", "Beaten", "Bruised",
    "Knocked down", "Immobilize", "Blunt weapon", "Stabbed", "Kicked on ground", "Hair pulling",
    "Knee strike", "Face punch", "Slamming", "Dragged", "Victim screaming", "Defensive posture",
    "Holding wounds", "Shoots", "Gunman", "Shooting", "Assailant", "Aim", "Armed", "Shot", "Aiming", "Raised",
    "Motionless", "Lies", "Struggles", "Disperses", "Gasping", "Shock", "Wounded", "Bleeding",
    "Fleeing", "Taking cover", "Bullet holes", "Gunfire", "Shell casing", "Trigger pull",
    "Collapse", "Firearm", "Reloading", "Rapid shots", "Panic", "Crowd running", "Screams",
    "Covering head", "Hit", "Downed", "Blood stains", "Emergency response", "Sirens",
    "Pistol", "Rifle", "Shotgun", "Automatic weapon", "Revolver", "Handgun", "Bullet",
    "Magazine", "Ammunition",
    "Participant", "Shouts", "Frozen", "Intruder", "Grappling", "Constant", "Motionless", "Approaches",
    "Attempting", "Clear", "Curves", "Gather", "Igniting", "Discussion", "Uncovered", "Suspicious",
    "Discussions", "Consistent", "Clustered", "Broken", "Opening", "Enclosed", "Illuminated", "Interacting",
    "Gestures", "Empty", "Steps", "Aligning", "Reached", "Warzone", "Dodges", "Accelerates", "Stabilizes",
    "Shove", "Enters", "Smooth", "Continues", "Figure", "Persists", "Shifting", "Discusses", "Dragged",
    "Walking", "Standing", "Sitting", "Talking", "Laughing", "Smiling", "Waving", "Greeting", "Browsing",
    "Shopping", "Looking around", "Passing by", "Waiting", "Checking phone", "Holding bags", "Carrying items"


]

# Load CLIP model
def load_clip_model(model_path):
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    state_dict = torch.load(model_path, map_location=device, weights_only=False)
    model.load_state_dict(state_dict, strict=False)
    model = model.to(device).eval()
    return model, processor

# Frame Extraction
def extract_frames(video_path, output_folder, fps=1, max_frames=30):
    if os.path.exists(output_folder):
        for file in os.listdir(output_folder):
            if file.endswith(".jpg"):
                os.remove(os.path.join(output_folder, file))
    else:
        os.makedirs(output_folder)

    cap = cv2.VideoCapture(video_path)
    count = 0
    saved = 0
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(original_fps // fps) if fps > 0 else 30

    while cap.isOpened() and saved < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if count % frame_interval == 0:
            frame_path = os.path.join(output_folder, f"frame_{saved:03}.jpg")
            cv2.imwrite(frame_path, frame)
            saved += 1
        count += 1
    cap.release()

# Zero-shot classification
def classify_image(model, processor, image_path, labels, top_k=3):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(text=labels, images=image, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image.softmax(dim=1)
    probs = logits_per_image[0].cpu().tolist()
    label_probs = list(zip(labels, probs))
    label_probs.sort(key=lambda x: x[1], reverse=True)
    return label_probs[:top_k]

# Load captions
def load_generalized_captions(path):
    with open(path, "r") as f:
        captions = [line.strip() for line in f if line.strip()]
    return captions

# Select best matching caption
def select_top_caption(model, processor, image_path, captions):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(text=captions, images=image, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)
    top_idx = torch.argmax(probs, dim=1).item()
    return captions[top_idx]

# Summarize
def summarize_captions(captions, max_length=500, min_length=100):
    summarizer = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn").to(device)
    tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
    input_text = " ".join(list(set(captions)))
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=1024, truncation=True).to(device)
    summary_ids = summarizer.generate(inputs, max_length=max_length, min_length=min_length, num_beams=4, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# Analyze image
def analyze_image(image_path):
    model, processor = load_clip_model(model_path)
    generalized_captions = load_generalized_captions("/Users/preetham_aleti/Desktop/scenesolver/generalized_captions_generalized.txt")

    crime_pred = classify_image(model, processor, image_path, crime_labels, top_k=1)
    evidence_pred = classify_image(model, processor, image_path, evidence_labels, top_k=3)
    best_caption = select_top_caption(model, processor, image_path, generalized_captions)

    summary = summarize_captions([best_caption])
    return {
        "crime": crime_pred[0][0],
        "evidence": [e[0] for e in evidence_pred],
        "final_summary": summary
    }

# Analyze video
def analyze_video(video_path):
    model, processor = load_clip_model(model_path)
    extract_frames(video_path, frames_dir)

    frame_paths = sorted([os.path.join(frames_dir, f) for f in os.listdir(frames_dir) if f.endswith(".jpg")])
    crime_votes = []
    evidence_counter = Counter()
    selected_captions = []

    generalized_captions = load_generalized_captions("/Users/preetham_aleti/Desktop/generalized_captions_generalized.txt")

    for frame in tqdm(frame_paths):
        crime_pred = classify_image(model, processor, frame, crime_labels, top_k=1)
        crime_votes.append(crime_pred[0][0])

        evidence_pred = classify_image(model, processor, frame, evidence_labels, top_k=3)
        for ev, _ in evidence_pred:
            evidence_counter[ev] += 1

        best_caption = select_top_caption(model, processor, frame, generalized_captions)
        selected_captions.append(best_caption)

    final_crime = Counter(crime_votes).most_common(1)[0][0]
    top_evidences = evidence_counter.most_common(10)
    story_summary = summarize_captions(selected_captions)

    return {
        "crime": final_crime,
        "evidence": [ev[0] for ev in top_evidences],
        "final_summary": story_summary
    }

# Unified entry point
def analyze_media(path):
    mime_type, _ = mimetypes.guess_type(path)
    if mime_type and mime_type.startswith("image"):
        return analyze_image(path)
    elif mime_type and mime_type.startswith("video"):
        return analyze_video(path)
    else:
        raise ValueError("Unsupported file type: must be image or video.")
