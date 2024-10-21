import path from 'path';
import fs from 'fs';
import { downloadImage } from '@/lib/image';

const { EXTERNAL_TEXTURE_URL } = process.env;

export async function POST(req) {
  try {
    const body = await req.json();
    const { defindex, paintindex } = body;
    const jsonPath = path.join(
      process.cwd(),
      'public',
      'data',
      'skins',
      `${defindex}`,
      `${paintindex}.json`,
    );

    const json = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(json);
    const data = parsed.data;

    if (data) {
      const imagePaths = data.map(
        (item) => `${EXTERNAL_TEXTURE_URL}/${item.texture}_component1_texture1.png`,
      );

      const defindexPath = path.join(process.cwd(), 'public', 'textures', `${defindex}`);
      const paintindexPath = path.join(defindexPath, `${paintindex}`);
      if (!fs.existsSync(defindexPath)) {
        fs.mkdirSync(defindexPath, { recursive: true });
      }
      if (!fs.existsSync(paintindexPath)) {
        fs.mkdirSync(paintindexPath, { recursive: true });
      }

      await Promise.all(
        imagePaths.map((url) => {
          const inputName = url.split('/').pop().replace('.png', '');
          const filePath = path.join(paintindexPath, `${inputName}.png`);
          downloadImage(url, filePath);
        }),
      );
    }

    return new Response('Scrapping textures success', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
