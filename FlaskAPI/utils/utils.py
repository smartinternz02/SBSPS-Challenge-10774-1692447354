from PIL import Image
import tempfile
import os   
import time 
import base64
# Global Initialization
new_names = {0: 'scratch', 1:'paint-off', 2 : 'crack',  3: 'missing-head', 4: 'dent'}

# To create a temp directory
def store_img_in_dir(temp_dir_path, file):
    # print(temp_dir_path, file.filename)
    file.save(os.path.join(temp_dir_path, file.filename.split('\\')[-1]))

# Categorising the severity and size for each defect type
def categorise_defect(type, area, im_size):
    
    max_area = im_size[0] * im_size[1]
    severity = None
    size = None
    
    # Scratch : 0
    if type == 0:
        if area >= max_area/15:
            size = 'big'
            severity = 'orange'
        elif area >= max_area/50:
            size = 'medium'
            severity = 'blue'
        else:
            size = 'small'
            severity = 'blue'
            
    # paintoff : 1
    elif type == 1:
        if area >= max_area/15:
            size = 'big'
            severity = 'red'
        elif area >= max_area/50:
            size = 'medium'
            severity = 'orange'
        else:
            size = 'small'
            severity = 'blue'
    # crack : 2
    elif type == 2:
        if area >= max_area/40:
            size = 'big'
            severity = 'red'
        elif area >= max_area/80:
            size = 'medium'
            severity = 'orange'
        elif area >= max_area/200:
            size = 'small'
            severity= 'orange'
        else:
            size = 'small'
            severity = 'blue'
    
    # missing head : 3
    elif type == 3:
        size = 'small'
        severity = 'blue'
    
    # dent : 4
    elif type == 4:
          if area >= max_area/25:
            size = 'big'
            severity = 'red'
          elif area >= max_area/70:
            size = 'medium'
            severity = 'orange'
          else:
            size = 'small'
            severity = 'blue'
    
    return size, severity

def create_user_dir_timestamp(main_dir, user_id):
    
    folder_path = os.path.join(main_dir, user_id)
    if not os.path.exists(folder_path):
        # If it doesn't exist, create the subdirectory
        os.makedirs(folder_path)
    timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")
    
    new_folder_path = os.path.join(folder_path, f"directory_{timestamp}")
    
    if not os.path.exists(new_folder_path):
        # If it doesn't exist, create the subdirectory
        os.makedirs(new_folder_path)
    # print("new : " , new_folder_path, folder_path)
    return new_folder_path
    
def build_image_summary(defects, im, path, my_dir,img_id):
    
    processed_image = dict()
    file_name = path.split('\\')[-1]
    processed_image['filename'] = file_name
    # print(my_dir, file_name )
    # Save annotated image in user folder in main directory
    result_photo_path = os.path.join(my_dir, file_name)
    # print(result_photo_path)
    im.save(result_photo_path)
    
    # Encode photo
    
    with open(result_photo_path, 'rb') as photo_file:
        encoded_photo = base64.b64encode(photo_file.read()).decode('utf-8')
    
    processed_image['data'] = encoded_photo
    processed_image['image_id'] = img_id
    processed_image['defects'] = defects
    
    keylist = ['name', 'total', 'red', 'orange', 'blue', 'big', 'medium', 'small']
    valuelist = [None, 0, 0, 0 ,0, 0, 0, 0]
    std_inner_dict = dict()
    
    for k,v in zip(keylist, valuelist):
        std_inner_dict[k] = v
        
    for i in new_names.keys():
        #print(i)
        # print(std_inner_dict)
       
        processed_image[str(i)] = std_inner_dict.copy()
        processed_image[str(i)]['name'] = new_names[i]
        # print(new_names[i], processed_image[str(i)]['name'] )
        
    
    for defect in defects:
        
        processed_image[str(defect['type'])]['total'] +=1
        processed_image[str(defect['type'])][defect['size']] += 1
        processed_image[str(defect['type'])][defect['severity']] += 1
        
    return processed_image

def build_response(processed_images):
    
    keylist = ['total_images_uploaded', 'total_defects', 'identified_defect_tags']
    valuelist = [0, 0, []]
    summary = dict()
    for k,v in zip(keylist, valuelist):
        summary[k] = v
    
    keylist2 = ['name', 'total', 'red', 'orange', 'blue', 'big', 'medium', 'small']
    valuelist2 = [None, 0, 0, 0 ,0, 0, 0, 0]
    std_inner_dict = dict()
    for k,v in zip(keylist2, valuelist2):
        std_inner_dict[k] = v
    
    temp = ['total', 'red', 'orange', 'blue', 'big', 'medium', 'small']
    for i in new_names.keys():
        
        summary[str(i)] = std_inner_dict.copy()
        summary[str(i)]['name'] = new_names[i]
    tot_defects = 0
    tags = set()
    for im_res in processed_images:

        for i in new_names.keys():
            for t in temp:
                summary[str(i)][t] += im_res[str(i)][t]
        
        for i in new_names.keys():
            if summary[str(i)]['total'] > 0:
                tags.add(new_names[i])
                tot_defects+=im_res[str(i)]['total']

    
    summary['identified_defect_tags'] = list(tags)
    summary['total_defects'] = tot_defects
    summary['total_images_uploaded'] = len(processed_images)
    
    return summary
    
    
    
    