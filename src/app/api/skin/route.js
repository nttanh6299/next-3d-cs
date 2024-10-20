import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'models', 'weapon_snip_awp.glb');
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        'Content-Type': 'model/gltf-binary',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response('File not found', { status: 404 });
  }
}
