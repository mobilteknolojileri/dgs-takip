import type { APIRoute } from 'astro';
import type { Env, SubjectResult } from '../../types';

interface SubjectStat extends SubjectResult {
  appearance_count: number;
  wrong_rate: number;
  total_correct: number;
  total_wrong: number;
  total_blank: number;
}

// GET: Genel istatistikler + konu bazlı analiz
export const GET: APIRoute = async () => {
  const { env } = await import('cloudflare:workers');
  const db = (env as Env).DB;

  // Toplam deneme sayısı
  const countResult = await db.prepare('SELECT COUNT(*) as total FROM exams').first();
  const totalExams = (countResult?.total as number) || 0;

  // Genel ortalamalar
  const avgResult = await db
    .prepare(
      `SELECT
        AVG(sayisal_net) as avg_sayisal,
        AVG(sozel_net) as avg_sozel,
        AVG(total_net) as avg_total,
        MAX(total_net) as max_total,
        MIN(total_net) as min_total,
        SUM(sayisal_correct) as total_sayisal_correct,
        SUM(sayisal_wrong) as total_sayisal_wrong,
        SUM(sozel_correct) as total_sozel_correct,
        SUM(sozel_wrong) as total_sozel_wrong
      FROM exams`,
    )
    .first();

  // Konu bazlı istatistikler
  const { results: subjectStats } = await db
    .prepare(
      `SELECT
        subject_name,
        category,
        SUM(correct) as total_correct,
        SUM(wrong) as total_wrong,
        SUM(blank) as total_blank,
        COUNT(*) as appearance_count,
        ROUND(CAST(SUM(wrong) AS FLOAT) / NULLIF(SUM(correct) + SUM(wrong), 0) * 100, 1) as wrong_rate
      FROM exam_subjects
      GROUP BY subject_name, category
      ORDER BY wrong_rate DESC`,
    )
    .all<SubjectStat>();

  // Son 20 deneme (trend için)
  const { results: recentExams } = await db
    .prepare(
      'SELECT name, exam_date, sayisal_net, sozel_net, total_net FROM exams ORDER BY exam_date ASC LIMIT 20',
    )
    .all();

  // En zayıf 5 konu
  const weakTopics = subjectStats.filter((s) => s.total_correct + s.total_wrong >= 2).slice(0, 5);

  return new Response(
    JSON.stringify({
      totalExams,
      averages: {
        sayisal: Math.round(((avgResult?.avg_sayisal as number) || 0) * 10) / 10,
        sozel: Math.round(((avgResult?.avg_sozel as number) || 0) * 10) / 10,
        total: Math.round(((avgResult?.avg_total as number) || 0) * 10) / 10,
        max: avgResult?.max_total || 0,
        min: avgResult?.min_total || 0,
      },
      totals: {
        sayisal_correct: avgResult?.total_sayisal_correct || 0,
        sayisal_wrong: avgResult?.total_sayisal_wrong || 0,
        sozel_correct: avgResult?.total_sozel_correct || 0,
        sozel_wrong: avgResult?.total_sozel_wrong || 0,
      },
      subjectStats,
      recentExams,
      weakTopics,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
