import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request, { params }: { params: { day: string } }) {
  try {
    const day = params.day;
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await connection.execute('SELECT * FROM memories WHERE day_number = ?', [day]);
    await connection.end();
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
