from flask import Flask, Response, request, jsonify, send_file, send_from_directory
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
from Preprocessing import *
import cv2

app = Flask(__name__)
cors = CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))

@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        bytesOfImage = request.get_data()
        with open('orig_img.jpeg', 'wb') as out:
            out.write(bytesOfImage)
            
        img = cv2.imread('orig_img.jpeg')
        processed_img = preprocess(img)
        print(basedir)
        #display_img(processed_img)
        cv2.imwrite("./corrected.png", processed_img)
        return send_file("./corrected.png", mimetype='image/png', as_attachment=True)

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(basedir, filename)

if __name__ == '__main__':
    app.run(host="192.168.43.104", port=5000)