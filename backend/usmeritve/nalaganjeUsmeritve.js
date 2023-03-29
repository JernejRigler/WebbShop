import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import multer from 'multer';
import { jeAdmin, jeAvtoriziran } from '../utils.js';

const upload = multer();

const nalaganjeUsmerjevalnik = express.Router();
nalaganjeUsmerjevalnik.post(
  '/',
  jeAvtoriziran,
  jeAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const zaPoslat = await streamUpload(req);
    res.send(zaPoslat);
  }
);
export default nalaganjeUsmerjevalnik;
