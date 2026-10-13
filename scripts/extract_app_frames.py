import cv2
import os
from PIL import Image

video_path = 'public/video/app.mp4'
out_dir = 'public/video/app_frames_webp'
os.makedirs(out_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

TARGET_FRAMES = 121 # Exactly matches the drone shot frame count (121 frames, index 0 to 120)
step = (total - 1) / (TARGET_FRAMES - 1)

print(f"Extracting {TARGET_FRAMES} frames from {total} source frames...")

for i in range(TARGET_FRAMES):
    frame_idx = int(round(i * step))
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ret, frame = cap.read()
    if not ret:
        print(f"Failed at {i} (frame {frame_idx})")
        break
    
    # Resize to 1280x720 for super fast load and crisp mobile/desktop presentation
    resized = cv2.resize(frame, (1280, 720), interpolation=cv2.INTER_AREA)
    # Convert BGR to RGB
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb)
    out_name = os.path.join(out_dir, f"f_{i:03d}.webp")
    img.save(out_name, "WEBP", quality=82)

cap.release()
print("Done extracting app frames!")
