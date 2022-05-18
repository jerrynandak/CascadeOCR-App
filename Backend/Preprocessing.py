from PerspectiveTransform import *
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
from sklearn import preprocessing
import joblib
from scipy.ndimage import interpolation as inter
import numpy as np
import cv2
import os
(img_width, img_height) = (224, 224)

def display_img(images, size=10):
    if type(images) is not list: images = [ images ]
    for image in images:
        plt.figure(figsize = (size,size))
        plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        plt.axis('off')
        plt.show()

def rotate_image(image, angle):
    image_center = tuple(np.array(image.shape[1::-1]) / 2)
    rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
    result = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR, borderValue=(255,255,255))
    return result

#model = load_model('model_v1.h5')
#scaler = joblib.load('scaler.joblib')

def correct_skew(image, delta=.1, limit=3):
    def determine_score(arr, angle):
        data = inter.rotate(arr, angle, reshape=False, order=0)
        histogram = np.sum(data, axis=1)
        score = np.sum((histogram[1:] - histogram[:-1]) ** 2)
        return histogram, score

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.medianBlur(gray, 3)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1] 

    scores = []
    angles = np.arange(-limit, limit + delta, delta)
    for angle in angles:
        histogram, score = determine_score(thresh, angle)
        scores.append(score)

    best_angle = angles[scores.index(max(scores))]

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, best_angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, \
              borderMode=cv2.BORDER_REPLICATE)

    return best_angle, rotated


def contour_segmentation(img, line_dilation_kernel_size=(1,110), min_line_height = 33):
    image = img.copy()
    print(image.shape)
    threshval, thresh = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    kernel = np.ones(line_dilation_kernel_size, np.uint8)
    img_line_dilation = cv2.dilate(thresh, kernel, iterations=1)
	
    ctrs, _hier = cv2.findContours(img_line_dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    sorted_ctrs = sorted(ctrs, key=lambda ctr: (cv2.boundingRect(ctr)[1] + 0.1*cv2.boundingRect(ctr)[0]))
    
    roi = []
    for i, ctr in enumerate(sorted_ctrs):
        x, y, w, h = cv2.boundingRect(ctr)
        if(h < min_line_height):
            continue
		
        roi.append((x, y, w, h))
    for el in roi:
        x, y, w, h = el
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
    return image

def preprocess(img):
    img_new = PerspectiveTransform(img)
    print(img_new.shape)
    
    img_denoised = median_filter(img_new)
    img_contour = contour_segmentation(img_denoised, min_line_height=10)
    #display_img(img_denoised)
    print(img_denoised.shape)
    
    #resized_img = cv2.resize(img_denoised, (img_width, img_height))
    
    #x_test = []
    #x_test.append(resized_img)
                  
    #x_np = np.array(x_test)
    #print(x_np.shape)
    
    #x_np = x_np.reshape(len(x_np), img_height, img_width, 3)    
    
    #pred = model.predict(x_np)
    
    #pred_angle = scaler.inverse_transform(pred.reshape(1,1))
    #print(pred)
    #print(pred_angle)
    #rotated_img = rotate_image(x_np[0], int(pred_angle[0]))
    #angle, rotated = correct_skew(img_denoised)
    
    #display_img(rotated)
    return img_contour
