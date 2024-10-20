import { chunk } from 'lodash';
import { HttpClient } from '@/lib/axios';
import { delay } from '@/lib/common';

const { EXTERNAL_API_URL } = process.env;

export async function POST(req) {
  try {
    const body = await req.json();
    const { defindex, paintindex } = body;

    const data = await HttpClient.get(
      `${EXTERNAL_API_URL}/skin/floatlist?defindex=${defindex}&paintindex=${paintindex}`,
    );

    if (data) {
      let skins = [];
      const chunks = chunk(data, 10);
      for (const chunkData of chunks) {
        const res = await Promise.all(
          chunkData.map((item) =>
            HttpClient.get(`${EXTERNAL_API_URL}/skin/uuid?uuid=${item.uuid}`),
          ),
        );
        skins = [...skins, ...res];
        await delay(1000);
      }

      return Response.json({ data: skins }, { status: 200 });
    }
    return new Response('Scrapping floatlist success', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Error', { status: 500 });
  }
}
