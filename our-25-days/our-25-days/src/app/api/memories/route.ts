import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

interface Block {
  block_type: 'title' | 'paragraph' | 'image' | 'quote' | 'highlight';
  content: string;
  sort_order: number;
}

interface DisplaySettings {
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const { day, blocks, settings }: { day: string; blocks: Block[]; settings?: DisplaySettings } = await request.json();
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    
    // Get memory ID
    const [memoryRows]: any = await connection.execute('SELECT id FROM memories WHERE day_number = ?', [day]);
    if (memoryRows.length === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    const memoryId = memoryRows[0].id;

    // Start transaction
    await connection.beginTransaction();

    if (blocks) {
      // Delete existing blocks
      await connection.execute('DELETE FROM memory_blocks WHERE memory_id = ?', [memoryId]);

      // Insert new blocks
      for (const block of blocks) {
        await connection.execute(
          'INSERT INTO memory_blocks (memory_id, block_type, content, sort_order) VALUES (?, ?, ?, ?)',
          [memoryId, block.block_type, block.content, block.sort_order]
        );
      }
    }

    if (settings) {
      await connection.execute(
        'UPDATE memories SET display_settings = ? WHERE id = ?',
        [JSON.stringify(settings), memoryId]
      );
    }

    // Commit transaction
    await connection.commit();
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    await connection.rollback();
    await connection.end();
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [memories]: any = await connection.execute('SELECT * FROM memories ORDER BY day_number ASC');
    
    for (const memory of memories) {
        const [blocks] = await connection.execute(
            'SELECT * FROM memory_blocks WHERE memory_id = ? ORDER BY sort_order ASC',
            [memory.id]
          );
        memory.blocks = blocks;
        if (memory.display_settings && typeof memory.display_settings === 'string') {
            memory.display_settings = JSON.parse(memory.display_settings);
        }
    }

    await connection.end();
    return NextResponse.json(memories);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
