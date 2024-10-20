import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ message: 'Something went wrong' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: HttpStatusCode.BadRequest },
    );
  }
}
