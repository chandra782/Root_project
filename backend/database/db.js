const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./jobs.db', (err) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to SQLite DB');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      taskName TEXT NOT NULL,
      payload TEXT,
      priority TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      completedAt DATETIME
    )
  `);
});

module.exports = db;
