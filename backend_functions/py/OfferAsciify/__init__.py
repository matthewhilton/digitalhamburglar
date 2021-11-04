from .ascii_func import asciify_image
import logging
import hashlib
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient
import os 
import tempfile
import requests
import wget
import uuid
from dotenv import load_dotenv

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    logging.info("Loading environment variables...")
    load_dotenv()

    conn_string = os.environ["ImageStorageAccountConnectionString"]

    if conn_string is None:
        logging.info("Storage account connection string was None")
        return func.HttpResponse(
             "Server Error",
             status_code=500
        )


    logging.info("Connecting to Azure storage")

    image = req.params.get('image')

    if not image:
        return func.HttpResponse(
             "Query param 'image' not given",
             status_code=400
        )
    else:
        # See if the image already exists 

        # Try and get blob to see if exists
        ascii_image_filename_blob = hashlib.md5(image.encode('utf-8')).hexdigest() + '.jpg'
        
        # See if exists already in blob storage
        blob_get_str = "https://offerimagestorev4.blob.core.windows.net/images/{0}".format(ascii_image_filename_blob)
        if does_blob_exist(blob_get_str):
            logging.info("Blob exists, redirecting...")
            blob_redirect = redirect_to_blob(blob_get_str)
            logging.info(blob_redirect)
            return blob_redirect
        else: 
            logging.info("Blob doesn't exist, generating...")

        offer_base_url = "https://au-prod-us-cds-oceofferimages.s3.amazonaws.com/oce3-au-prod/offers/"
        offer_image_url = offer_base_url + image


        logging.info("Getting temp directory...")
        tempdir = tempfile.gettempdir()

        logging.info("Temp directory: {0}".format(tempdir))

        logging.info("Downloading offer from aws...")
        logging.info("Downloading {0} to {1}".format(offer_image_url, tempdir))

        #Download the offer image from aws -> temp directory
        offer_original_filename = wget.download(offer_image_url, os.path.join(tempdir, uuid.uuid1().hex + ".jpg"))

        logging.info("Downloaded as {0}".format(offer_original_filename))
        offer_original_filepath = os.path.join(tempdir, offer_original_filename)
        logging.info("Offer downloaded path is now {0}".format(offer_original_filepath))

        logging.info("Asciifying image")
        # Pass the filepath to the asciify_image function
        ascii_filepath, ascii_filename = asciify_image(offer_original_filepath)

        if ascii_filepath is None or ascii_filename is None:
            return func.HttpResponse(
                "Could not process file",
                status_code=500
            )
        
        # Else upload to storage
        logging.info("Uploading output to blob storage")
        blob = BlobClient.from_connection_string(conn_str=conn_string, container_name="images", blob_name=ascii_image_filename_blob)
        with open(ascii_filepath, "rb") as data:
            blob.upload_blob(data, overwrite=True)
        
        upload_url = blob.url

        blob_redirect = redirect_to_blob(upload_url)
        logging.info(blob_redirect)

        return blob_redirect

def redirect_to_blob(blob_path):
    return func.HttpResponse(
        status_code=302,
        body=None,
        headers= {
            "location": blob_path,
        }
    )

def does_blob_exist(blob_get_str):
    logging.info("Trying to get blob from {0}".format(blob_get_str))

    try:
        response = requests.get(blob_get_str)

        logging.info(response)

        if response.status_code == 200:
            return True
        else:
            return False

    except Exception as e:
        logging.info(e)
        return False
