import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'textures',
      '1d16102c55b03c334005f3c7cfabce79_component1_texture1.png',
    );
    const file = await fs.readFile(filePath);
    return new Response(file);
  } catch (error) {
    console.log(error);
    return new Response('File not found', { status: 404 });
  }
}
