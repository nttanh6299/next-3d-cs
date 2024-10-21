import path from 'path';
import fs from 'fs';
import { delay } from '@/lib/common';
import { downloadImage, resizeImage } from '@/lib/image';

const { EXTERNAL_IMAGE_URL } = process.env;

export async function POST(req) {
  try {
    const body = await req.json();
    const { defindex } = body;
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'paintindexes', `${defindex}.json`);

    const json = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(json);
    const data = parsed.data;

    if (data) {
      const imagePaths = data.map((item) => `${EXTERNAL_IMAGE_URL}/${item.uuid}_icon.png`);

      await Promise.all(
        imagePaths.map((url) => {
          const name = url.split('/').pop().replace('.png', '');
          const inputName = `i-${name}`;
          const filePath = path.join(process.cwd(), 'public', 'images', '0', `${inputName}.png`);
          const outputFilePath = path.join(process.cwd(), 'public', 'images', '0', `${name}.webp`);
          downloadImage(url, filePath).then(async () => {
            await delay(500);
            return resizeImage(filePath, outputFilePath, 256, 256);
          });
        }),
      );
    }

    return new Response('Scrapping paintindex thumbnail success', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
