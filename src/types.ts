/** Cloudflare D1 prepared statement */
export interface D1PreparedStatement {
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
  run: () => Promise<{ meta: { last_row_id: number } }>;
  bind: (...args: unknown[]) => D1PreparedStatement;
}

/** Cloudflare D1 Database */
export interface D1DB {
  prepare: (query: string) => D1PreparedStatement;
  batch: (stmts: D1PreparedStatement[]) => Promise<unknown>;
}

/** Astro Cloudflare runtime env */
export interface CloudflareEnv {
  runtime: {
    env: {
      DB: D1DB;
    };
  };
}

/** Deneme kayıt */
export interface ExamRecord {
  id: number;
  name: string;
  publisher: string | null;
  exam_date: string;
  sayisal_correct: number;
  sayisal_wrong: number;
  sayisal_blank: number;
  sayisal_net: number;
  sozel_correct: number;
  sozel_wrong: number;
  sozel_blank: number;
  sozel_net: number;
  total_net: number;
  notes: string | null;
  created_at: string;
}

/** Konu sonucu */
export interface SubjectResult {
  id: number;
  exam_id: number;
  subject_name: string;
  category: 'sayisal' | 'sozel';
  correct: number;
  wrong: number;
  blank: number;
}

/** POST body for creating exam */
export interface CreateExamBody {
  name: string;
  publisher?: string;
  exam_date: string;
  sayisal_correct: number;
  sayisal_wrong: number;
  sayisal_blank: number;
  sozel_correct: number;
  sozel_wrong: number;
  sozel_blank: number;
  notes?: string;
  subjects: Array<{
    subject_name: string;
    category: 'sayisal' | 'sozel';
    correct: number;
    wrong: number;
    blank: number;
  }>;
}
