import { chunk, groupBy, minBy } from 'lodash';
import fs from 'fs';
import path from 'path';
import { HttpClient } from '@/lib/axios';
import { delay } from '@/lib/common';

const { EXTERNAL_API_URL } = process.env;

export async function POST(req) {
  try {
    const body = await req.json();
    const { defindex, paintindex, slot } = body;

    const data = await HttpClient.get(
      `${EXTERNAL_API_URL}/skin/floatlist?defindex=${defindex}&paintindex=${paintindex}`,
    );

    if (data) {
      let resSkins = [];
      const chunks = chunk(data, 10);
      for (const chunkData of chunks) {
        const res = await Promise.all(
          chunkData.map((item) =>
            HttpClient.get(`${EXTERNAL_API_URL}/skin/uuid?uuid=${item.uuid}`),
          ),
        );
        resSkins = [...resSkins, ...res];
        await delay(1000);
      }

      const groups = groupBy(
        resSkins.filter((item) => !!item.uvType),
        'wear_name',
      );
      const floatlist = Object.values(groups).map((values) => minBy(values, 'floatvalue'));
      let skins = floatlist.map((item) => ({
        uuid: item.uuid,
        item_name: item.item_name,
        wear_name: item.wear_name,
        skin_name: item.skin_name,
        rarity_name: item.rarity_name,
        uvType: item.uvType,
        defindex: item.defindex,
        paintindex: item.paintindex,
        texture: item.texture,
        material: {
          name: item.item.paint_data.paintablematerial0.name,
          uvscale: item.item.paint_data.paintablematerial0.uvscale,
        },
      }));

      if (slot) {
        skins = floatlist.map((item) => ({ ...item, slot }));
      }

      const defindexPath = path.join(process.cwd(), 'public', 'data', 'skins', `${defindex}`);
      if (!fs.existsSync(defindexPath)) {
        fs.mkdirSync(defindexPath, { recursive: true });
      }

      await fs.promises.writeFile(
        path.join(defindexPath, `${paintindex}.json`),
        JSON.stringify({ data: skins }),
        'utf8',
      );

      return Response.json(
        {
          data: skins,
        },
        { status: 200 },
      );
    }
    return new Response('Scrapping floatlist success', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Error', { status: 500 });
  }
}
