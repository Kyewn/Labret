import pathlib
import requests
import shutil
from flask import Blueprint, request, jsonify
from roboflowLabret import rfLabretFaceProject
from dotenv import load_dotenv
import os
import cv2 as cv
from api.predict import convertBase64ToCvImage
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

load_dotenv()

register = Blueprint('register', __name__)
cipher_key = bytes(f"{os.getenv('CIPHER_KEY')}", encoding='utf-8')
cipher_iv = b"9876512340abcdef"

@register.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    id = data["id"]
    name = data["name"]
    images = list(data["images"])
    
    # Save images locally first to get path
    # Create folders on init
    # TODO Relocate dir create commands to respective functions
    pathlib.Path('./images').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/new_faces').mkdir(parents=True, exist_ok=True)

    uploadedImgInfos = []
    
    # Temporarily write image files locally for upload later 
    for (i, image) in enumerate(images):
        filePath = f"./images/new_faces/{id}_{name}_{i}.jpg"
        cvImage = convertBase64ToCvImage(image)
    
        # Crop image ROI
        # image_crop = cvImage[90:390, 165:475]
        cv.imwrite(filePath, cvImage)

        # Send image to roboflow        
        # Get uploaded image id
        uploadedImg = rfLabretFaceProject.single_upload(filePath, tag_names=[id])
        
        # Get image info overview using id
        imageInfoURL = f"https://api.roboflow.com/"\
        f"{os.getenv('ROBOFLOW_WORKSPACE_ID')}/"\
        f"{os.getenv('ROBOFLOW_FACE_PROJECT_ID')}/"\
        f"images/{uploadedImg.get('image').get('id')}?api_key={os.getenv('ROBOFLOW_API_KEY')}"
        res = requests.get(imageInfoURL)
        imageInfo = res.json()
        uploadedImgInfos.append(imageInfo)

    # Remove temp image files
    shutil.rmtree(pathlib.Path('./images/new_faces'))

    return jsonify({
        'message': 'User registered successfully',
        'uploadedImageInfos': uploadedImgInfos
    })

@register.route('/encrypt-password', methods=['POST'])
def encrypt_password():
    cipher = AES.new(cipher_key, AES.MODE_CBC, iv=cipher_iv)

    password = request.get_json()["password"]
    b_password = password.encode('utf-8')
    padded_password = pad(b_password, AES.block_size)

    enc_password = cipher.encrypt(padded_password)
    hex_password = enc_password.hex()

    return jsonify({
        'message': 'Password encryption successful',
        "encryptedPassword": hex_password
    })

@register.route('/decrypt-password', methods=['POST'])
def decrypt_password():
    cipher = AES.new(cipher_key, AES.MODE_CBC, iv=cipher_iv)

    hex_password = request.get_json()["encryptedPassword"]
    enc_password = bytes.fromhex(hex_password)
    padded_password = cipher.decrypt(enc_password)

    b_password = unpad(padded_password, AES.block_size)
    password = b_password.decode('utf-8')

    return jsonify({
        'message': 'Password decryption successful',
        "decryptedPassword": password
    })