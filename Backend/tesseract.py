import cv2
import numpy as np
import pytesseract
import docx

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def tesseract_pdf(img):
    text_pdf = pytesseract.image_to_pdf_or_hocr(img)
    with open('result.pdf', 'w+b') as f:
        f.write(text_pdf)

def tesseract_word(img):
    text_string = pytesseract.image_to_string(img)
    result_doc = docx.Document()
    result_doc.add_paragraph(text_string)
    result_doc.save("result.docx")