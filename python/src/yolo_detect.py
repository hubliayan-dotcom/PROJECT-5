# python/src/yolo_detect.py
import cv2
try:
    from ultralytics import YOLO
except ImportError:
    print("YOLOv8 not installed. Run: pip install ultralytics")

class ObjectDetector:
    def __init__(self, model_size='yolov8n'):
        print(f'Loading {model_size}...')
        try:
            self.model = YOLO(f'{model_size}.pt')   # Auto-downloads on first run
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
            
        self.nav_actions = {
            'person':'STOP',    'car':'SLOW DOWN',  'truck':'SLOW DOWN',
            'bicycle':'CAUTION','dog':'CAUTION',
            'traffic light':'CHECK SIGNAL','stop sign':'STOP'
        }

    def detect(self, image_path, conf=0.4, save=True):
        if self.model is None:
            return None, []
            
        frame = cv2.imread(image_path)
        if frame is None:
            print('Error: Image not found'); return None, []
        results = self.model(frame, conf=conf, verbose=False)
        detections = []
        for result in results:
            for box in result.boxes:
                cls    = self.model.names[int(box.cls[0])]
                conf_v = round(float(box.conf[0]),2)
                action = self.nav_actions.get(cls,'MONITOR')
                x1,y1,x2,y2 = map(int,box.xyxy[0])
                color  = (0,255,0) if action=='MONITOR' else (0,0,255)
                cv2.rectangle(frame,(x1,y1),(x2,y2),color,2)
                label = f'{cls} {conf_v} | {action}'
                cv2.putText(frame,label,(x1,y1-8),
                    cv2.FONT_HERSHEY_SIMPLEX,0.5,(255,255,255),1)
                detections.append({'class':cls,'confidence':conf_v,'action':action})
        cv2.putText(frame,'AI NAVIGATION - PERCEPTION LAYER',
            (10,25),cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,255,255),2)
        if save:
            cv2.imwrite('outputs/screenshots/detection_result.jpg',frame)
        return frame, detections
