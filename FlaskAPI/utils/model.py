import ultralytics
from ultralytics import YOLO
import cv2
from PIL import Image
import numpy as np
import utils.utils as utils
# Global Initialization
new_names = {0: 'scratch', 1:'paint-off', 2 : 'crack',  3: 'missing-head', 4: 'dent'}

def process_images(temp_dir_path, my_dir):
    
    # predict the masks
    
    results = predict(temp_dir_path)
    
    # process results
    
    processed_images = process_results(results, my_dir)
    
    return processed_images
    
def predict(temp_dir_path):
    model = YOLO("utils\yolov8n_best100.pt")
    
    results = model.predict(
    task = "segment", 
    conf = 0.3, 
    source = temp_dir_path,
    )
    
    return results

def process_results(results, my_dir):
    
    # Local Initialization
    
    names = {0: 'crack', 1: 'dent', 2: 'missing-head', 3: 'paint-off', 4: 'scratch'}
    change_dict = {0:2, 1:4, 2:3, 3:1, 4:0}
    
    processed_images = []
    for r in results:
        im_array = r.plot(boxes = True,labels=False)  # plot a BGR numpy array of predictions
        im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
        defects = []
        
        for i in range(len(r.boxes)):
            
            defects.append(dict())
            # Change the defect type chart to pre defined chart
            defects[i]['type'] = change_dict[int(r.boxes.cls[i])]
            # Bounding Box coordinates
            defects[i]['coords'] = r.boxes.xywhn[i].tolist()
            
            # Area enclosed by the mask polygon
            polygon_coords = np.array(r.masks.xy[i]).astype(np.int32)
            image = np.zeros((640, 640), dtype=np.uint8)
            cv2.fillPoly(image, [polygon_coords], 255)
            contours, _ = cv2.findContours(np.array(r.masks.xy[i]).astype(np.uint8), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            area = cv2.contourArea(contours[0])
            
            defects[i]['size'], defects[i]['severity'] = utils.categorise_defect(defects[i]['type'], area, im.size)
        
        # print(defects)
        
        processed_images.append(utils.build_image_summary(defects, im, r.path, my_dir, len(processed_images)))
    
    return processed_images
        
        
        
            
