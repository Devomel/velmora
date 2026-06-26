CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  source     TEXT    NOT NULL,
  name       TEXT,
  phone      TEXT,
  email      TEXT,
  product    TEXT,
  qty        INTEGER DEFAULT 1,
  total      REAL,
  currency   TEXT,
  status     TEXT    NOT NULL DEFAULT 'new',
  notes      TEXT
);
