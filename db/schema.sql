-- DGS Deneme Takip Veritabanı Şeması

-- Denemeler tablosu
CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  publisher TEXT,
  exam_date TEXT NOT NULL,
  sayisal_correct INTEGER DEFAULT 0,
  sayisal_wrong INTEGER DEFAULT 0,
  sayisal_blank INTEGER DEFAULT 0,
  sayisal_net REAL DEFAULT 0,
  sozel_correct INTEGER DEFAULT 0,
  sozel_wrong INTEGER DEFAULT 0,
  sozel_blank INTEGER DEFAULT 0,
  sozel_net REAL DEFAULT 0,
  total_net REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Konu bazlı sonuçlar (konu listesi frontend'de tutulur, burada sadece sonuçlar kaydedilir)
CREATE TABLE IF NOT EXISTS exam_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  subject_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('sayisal', 'sozel')),
  correct INTEGER DEFAULT 0,
  wrong INTEGER DEFAULT 0,
  blank INTEGER DEFAULT 0,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);
