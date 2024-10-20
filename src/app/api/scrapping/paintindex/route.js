import { saveToJson } from '@/app/api/utils';
import { HttpClient } from '@/lib/axios';
import { getParams } from '@/lib/common';

const { EXTERNAL_API_URL } = process.env;

export async function POST(req) {
  try {
    const body = await req.json();
    const { defindex } = body;
    const data = await HttpClient.get(
      `${EXTERNAL_API_URL}/skin/paintindexes?${getParams({ defindex })}`,
    );

    if (data) {
      const obj = {
        data: data.map((item) => ({ ...item, defindex })),
      };
      await Promise.all([saveToJson(obj, `${defindex}`, 'paintindexes')]);
    }

    return new Response('Scrapping paintindex success', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
