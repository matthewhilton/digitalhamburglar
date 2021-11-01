from img2img_color import main
from PIL import Image, ImageEnhance
import wget
import os
import hashlib
import json

class dotdict(dict):
    """dot.notation access to dictionary attributes"""
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__

def asciify_image(input_image_name):
    offer_base_url = "https://au-prod-us-cds-oceofferimages.s3.amazonaws.com/oce3-au-prod/offers/"

    offer_image_url = offer_base_url + input_image_name

    filename = wget.download(offer_image_url)

    input_image_hash_filename = hashlib.md5(input_image_name.encode('utf-8')).hexdigest() + '.jpg'

    options = dotdict({
        'input': filename,
        'output': input_image_hash_filename,
        'mode': "complex",
        'scale': 5,
        'num_cols': 45,
        'background': "black"
    })

    # Convert image -> ascii image
    main(options)

    # Delete temporary file from before
    os.remove(filename)

    # Open the output image to do some more transformations
    im = Image.open(input_image_hash_filename)

    # Crop off ugly top part
    width, height = im.size
    im = im.crop((10, 100, width-10, height))

    # Resize to square
    newsize = (400,400)
    im = im.resize(newsize)

    # Add contrast
    enhancer = ImageEnhance.Contrast(im)
    im = enhancer.enhance(2)

    # Add color filter 
    im = im.convert("RGB")

    pixels = im.load()
    for i in range(im.size[0]):    # for every col:
        for j in range(im.size[1]):    # For every row
            values = pixels[i,j]
            offset = 40
            average = (sum(values) + offset) // (len(values) + 1)
            pixels[i,j] = (0,average,0)

    # Do something with image such as upload to S3...
    # TODO

    output_filename = "output_" + input_image_hash_filename
    im.save(output_filename)

    # Delete temp downloaded file
    os.remove(input_image_hash_filename)

    return output_filename

def lambda_handler(event, context):
    output_filename = asciify_image("88b9192b9dad3b546d374d53b8d236923fbd81f5.jpg")
    return {
        'statusCode': 200,
        'body': output_filename,
    }