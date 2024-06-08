#!/bin/bash

#load environment variable from .env file
export $(grep -v '^#' .env | xargs)
gcloud run deploy api-giziwise \
    --image gcr.io/capstone-ch241-ps176/giziwise:0.1 \
    --platform managed \
    --region asia-southeast2 \
    --allow-unauthenticated \
    --update-env-vars DB_HOST=$DB_HOST,DB_USER=$DB_USER,DB_PASSWORD=$DB_PASSWORD,DB_NAME=$DB_NAME,JWT_SECRET=$JWT_SECRET
