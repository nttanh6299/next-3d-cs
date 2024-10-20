import { saveToJson } from '@/app/api/utils';
import { HttpClient } from '@/lib/axios';
import { groupBy } from 'lodash';

const { EXTERNAL_API_URL } = process.env;

export async function POST() {
  try {
    const data = await HttpClient.get(`${EXTERNAL_API_URL}/skin/defindexes`);
    if (data) {
      const group = groupBy(data, 'type_name');
      const category = Object.entries(group)
        .filter(([key]) => key !== 'Agent')
        .reduce(
          (acc, [key, values]) => ({ ...acc, [key !== 'undefined' ? key : 'Equipment']: values }),
          {},
        );
      const obj = {
        data: category,
      };
      await Promise.all([saveToJson(obj, 'defindex', '')]);
    }

    return new Response('Scrapping defindex success', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
