import type { APIRoute } from 'astro';
import type { Env, CreateExamBody } from '../../types';

// GET: Tüm denemeleri listele
export const GET: APIRoute = async () => {
  const { env } = await import('cloudflare:workers');
  const db = (env as Env).DB;

  const { results: exams } = await db.prepare('SELECT * FROM exams ORDER BY exam_date DESC').all();

  return new Response(JSON.stringify({ exams }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST: Yeni deneme ekle
export const POST: APIRoute = async ({ request }) => {
  const { env } = await import('cloudflare:workers');
  const db = (env as Env).DB;
  const body = (await request.json()) as CreateExamBody;

  const {
    name,
    publisher,
    exam_date,
    sayisal_correct = 0,
    sayisal_wrong = 0,
    sayisal_blank = 0,
    sozel_correct = 0,
    sozel_wrong = 0,
    sozel_blank = 0,
    time_spent = 0,
    notes = '',
    subjects = [],
  } = body;

  // Net hesapla: Doğru - (Yanlış / 4)
  const sayisal_net = sayisal_correct - sayisal_wrong / 4;
  const sozel_net = sozel_correct - sozel_wrong / 4;
  const total_net = sayisal_net + sozel_net;

  // Deneme ekle
  const result = await db
    .prepare(
      `INSERT INTO exams (name, publisher, exam_date, sayisal_correct, sayisal_wrong, sayisal_blank, sayisal_net, sozel_correct, sozel_wrong, sozel_blank, sozel_net, total_net, time_spent, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      name,
      publisher || null,
      exam_date,
      sayisal_correct,
      sayisal_wrong,
      sayisal_blank,
      sayisal_net,
      sozel_correct,
      sozel_wrong,
      sozel_blank,
      sozel_net,
      total_net,
      time_spent,
      notes,
    )
    .run();

  const examId = result.meta.last_row_id;

  // Konu detaylarını ekle
  if (subjects.length > 0) {
    const stmt = db.prepare(
      `INSERT INTO exam_subjects (exam_id, subject_name, category, correct, wrong, blank) VALUES (?, ?, ?, ?, ?, ?)`,
    );

    const batch = subjects.map((s) =>
      stmt.bind(examId, s.subject_name, s.category, s.correct || 0, s.wrong || 0, s.blank || 0),
    );

    await db.batch(batch);
  }

  return new Response(JSON.stringify({ id: examId, total_net }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
