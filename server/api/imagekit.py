from flask import Blueprint, jsonify
from imagekitio import ImageKit
import os
import uuid

publicKey = os.getenv("IMAGEKIT_PUBLIC_KEY")
privateKey = os.getenv("IMAGEKIT_PRIVATE_KEY")

imagekit = Blueprint('imagekit', __name__)

ik = ImageKit(
    private_key=privateKey,
    public_key=publicKey,
    url_endpoint = 'https://ik.imagekit.io/oowu'
)

@imagekit.route('/imagekit-auth')
def imagekit_auth():
    auth_params = ik.get_authentication_parameters()

    return jsonify({
        'auth_params': auth_params,
    })

