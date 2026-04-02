import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../types';

// GET: Tek deneme detay
export const GET: APIRoute = async ({ params, locals }) => {
  const { DB: db } = (locals as unknown as CloudflareEnv).runtime.env;
  const { id } = params;

  const exam = await db.prepare('SELECT * FROM exams WHERE id = ?').bind(id).first();

  if (!exam) {
    return new Response(JSON.stringify({ error: 'Deneme bulunamadı' }), { status: 404 });
  }

  const { results: subjects } = await db
    .prepare('SELECT * FROM exam_subjects WHERE exam_id = ? ORDER BY category, id')
    .bind(id)
    .all();

  return new Response(JSON.stringify({ exam, subjects }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// DELETE: Deneme sil
export const DELETE: APIRoute = async ({ params, locals }) => {
  const { DB: db } = (locals as unknown as CloudflareEnv).runtime.env;
  const { id } = params;

  await db.prepare('DELETE FROM exam_subjects WHERE exam_id = ?').bind(id).run();
  await db.prepare('DELETE FROM exams WHERE id = ?').bind(id).run();

  return new Response(JSON.stringify({ deleted: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
