import path from 'path';
import { promises as fs } from 'fs';

export async function saveToJson(obj, fileName, folder) {
  const json = JSON.stringify(obj);
  const filePath = path.join(process.cwd(), 'public', 'data', folder, `${fileName}.json`);
  return fs.writeFile(filePath, json, 'utf8');
}
