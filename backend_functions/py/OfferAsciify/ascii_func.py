from .img2img_color import main
from PIL import Image, ImageEnhance
import wget
import os
import hashlib
import json
import tempfile
import logging
import uuid

logger = logging.getLogger('Ascii_Func')

class dotdict(dict):
    """dot.notation access to dictionary attributes"""
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__

def asciify_image(input_image_path):
    try:
        temp_file_name = uuid.uuid1().hex + ".jpg"
        temp_file_path = os.path.join(tempfile.gettempdir(), temp_file_name)

        options = dotdict({
            'input': input_image_path,
            'output': temp_file_path,
            'mode': "complex",
            'scale': 5,
            'num_cols': 80,
            'background': "black"
        })

        logger.info(options)

        # Convert image -> ascii image
        main(options)

        # Open the output image to do some more transformations
        im = Image.open(temp_file_path)

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
                pixels[i,j] = (average,0,average // 2)

        # Do something with image such as upload to S3...
        # TODO

        im.save(temp_file_path)
        logger.info("Asciified image saved to {0}".format(temp_file_path))

        return temp_file_path, temp_file_name
    except Exception as e:
        logger.info("Could not process file. Error: {0}".format(e))
        return None, None
    