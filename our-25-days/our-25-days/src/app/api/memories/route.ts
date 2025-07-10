import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mysql from 'mysql2/promise';

async function getS3Client() {
  return new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

async function uploadToS3(file: Buffer, fileName: string, contentType: string) {
  const s3Client = await getS3Client();
  // Ensure content type is an image type for direct browser display
  let finalContentType = contentType;
  if (!contentType || (!contentType.startsWith('image/') && !contentType.startsWith('video/'))) {
    // Default to image/jpeg if not specified or not an image/video type
    finalContentType = 'image/jpeg';
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: finalContentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const day = formData.get('day') as string;
    const title = formData.get('title') as string;
    const textContent = formData.get('textContent') as string;
    const media = formData.get('media') as File;

    const buffer = Buffer.from(await media.arrayBuffer());
    const mediaUrl = await uploadToS3(buffer, media.name, media.type);

    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + (parseInt(day) - new Date().getDate()));

    const [result] = await connection.execute(
      'INSERT INTO memories (day_number, release_date, title, text_content, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)',
      [day, releaseDate, title, textContent, mediaUrl, media.type.split('/')[0]]
    );
    await connection.end();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    try {
      const formData = await request.formData();
      const day = formData.get('day') as string;
      const title = formData.get('title') as string;
      const textContent = formData.get('textContent') as string;
      const media = formData.get('media') as File | null;
  
      const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
      if (media) {
        const buffer = Buffer.from(await media.arrayBuffer());
        const mediaUrl = await uploadToS3(buffer, media.name, media.type);
        await connection.execute(
          'UPDATE memories SET title = ?, text_content = ?, media_url = ?, media_type = ? WHERE day_number = ?',
          [title, textContent, mediaUrl, media.type.split('/')[0], day]
        );
      } else {
        await connection.execute(
          'UPDATE memories SET title = ?, text_content = ? WHERE day_number = ?',
          [title, textContent, day]
        );
      }
  
      await connection.end();
  
      return NextResponse.json({ success: true });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

export async function GET() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await connection.execute('SELECT * FROM memories ORDER BY day_number ASC');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
