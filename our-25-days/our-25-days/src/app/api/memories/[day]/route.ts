import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface MemoryRow extends RowDataPacket {
    day_number: number;
    release_date: string;
    block_type: 'title' | 'paragraph' | 'image' | 'quote' | 'highlight';
    content: string;
    sort_order: number;
}

export async function GET(request: Request, { params }: { params: { day: string } }) {
  try {
    const day = params.day;
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await connection.execute<MemoryRow[]>(
      `SELECT m.day_number, m.release_date, mb.block_type, mb.content, mb.sort_order
       FROM memories m
       LEFT JOIN memory_blocks mb ON m.id = mb.memory_id
       WHERE m.day_number = ?
       ORDER BY mb.sort_order ASC`,
      [day]
    );
    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      const memory = {
        day_number: rows[0].day_number,
        release_date: rows[0].release_date,
        blocks: rows.map(row => ({
          block_type: row.block_type,
          content: row.content,
          sort_order: row.sort_order
        })).filter(block => block.block_type) // Filter out potential null blocks if no blocks exist
      };
      return NextResponse.json(memory);
    } else {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
