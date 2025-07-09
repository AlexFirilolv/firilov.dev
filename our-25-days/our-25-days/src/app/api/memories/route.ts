import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mysql from 'mysql2/promise';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToS3(file: Buffer, fileName: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const day = formData.get('day') as string;
    const title = formData.get('title') as string;
    const textContent = formData.get('textContent') as string;
    const media = formData.get('media') as File;

    const buffer = Buffer.from(await media.arrayBuffer());
    const mediaUrl = await uploadToS3(buffer, media.name);

    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const releaseDate = new Date('2025-07-19');
    releaseDate.setDate(releaseDate.getDate() + parseInt(day));

    const [result] = await connection.execute(
      'INSERT INTO memories (day_number, release_date, title, text_content, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)',
      [day, releaseDate, title, textContent, mediaUrl, media.type.split('/')[0]]
    );
    await connection.end();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await connection.execute('SELECT * FROM memories ORDER BY day_number ASC');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
