from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import tempfile
import utils.utils as my_utils
import utils.model as my_model
app = Flask(__name__)
CORS(app) 

# Global Initialization

main_dir = 'photos/'
    
@app.route('/flask', methods=['POST'])
def upload_files():
    print('req recv2')
    uploaded_files = request.files.getlist('photos')
    selected_flight = request.form.get('selectedFlight')
    selected_date = request.form.get('selectedDate')
    user_id = request.form.get('user_id')
    number_input1 = int(request.form.get('numberInput1'))
    # print('data 1 : ',data);
    flight_number = request.form.get('flightNumber')
    # print('data 2 : ',data);
    flight_info = {'selected_flight' : selected_flight,'selected_date' : selected_date,'number_input1' : number_input1,'flight_number' : flight_number}
    # data['flight_info'] = flight_info
    # print('data 3 : ',data);
    #print(selected_flight,selected_date,number_input1,flight_number)
    
    # Get user primary_key
    
    # user_id = '9150221514'
    # uploaded_photos = []
    
    # Create a temp directory
    
    try : 
        temp_dir = tempfile.TemporaryDirectory()
        temp_dir_path = temp_dir.name
        
    except Exception as e:
        print("[Error] Error while creating temporary directory\n", e)
        
    # Upload the photos to a temp directory
    
    for file in uploaded_files:
        my_utils.store_img_in_dir(temp_dir_path, file)
    
    # Create a user specific directory if it doesnt exist and add a new directory with timestamp
    
    my_dir = my_utils.create_user_dir_timestamp(main_dir, user_id)
    #print(my_dir)
    # Process all images
    
    processed_images = my_model.process_images(temp_dir_path, my_dir)
    
    response_data = dict()
    response_data['flight_info'] = flight_info
    response_data['summary'] = my_utils.build_response(processed_images)
    response_data['uploaded_photos'] = processed_images
    
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run()
