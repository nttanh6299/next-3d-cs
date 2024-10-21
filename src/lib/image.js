import fs from 'fs';
import sharp from 'sharp';
import { HttpClient } from '@/lib/axios';

export async function downloadImage(url, filePath) {
  try {
    const response = await HttpClient.get(url, {
      responseType: 'stream',
    });

    response.pipe(fs.createWriteStream(filePath));

    return new Promise((resolve, reject) => {
      response.on('end', () => {
        resolve('File downloaded successfully');
      });

      response.on('error', (err) => {
        reject('Error downloading file: ', err);
      });
    });
  } catch (error) {
    console.error('Error while downloading the image:', error);
  }
}

export async function resizeImage(inputPath, outputPath, width, height) {
  try {
    await sharp(inputPath).resize(width, height).webp({ quality: 100 }).toFile(outputPath);
  } catch (error) {
    console.error('Error resizing image:', error);
  }
}
