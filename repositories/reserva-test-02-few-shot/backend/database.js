import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabelas
      db.run(`
        CREATE TABLE IF NOT EXISTS tutors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS pets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          tutor_id INTEGER NOT NULL,
          FOREIGN KEY (tutor_id) REFERENCES tutors(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS hosts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tutor_id INTEGER NOT NULL,
          pet_id INTEGER NOT NULL,
          host_id INTEGER NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')),
          FOREIGN KEY (tutor_id) REFERENCES tutors(id),
          FOREIGN KEY (pet_id) REFERENCES pets(id),
          FOREIGN KEY (host_id) REFERENCES hosts(id)
        )
      `);

      // Dados de demonstração
      db.run("INSERT INTO tutors (id, name, email) VALUES (1, 'Tutor Exemplo', 'tutor@exemplo.com')");
      db.run("INSERT INTO pets (id, name, type, tutor_id) VALUES (1, 'Rex', 'Cachorro', 1)");
      db.run("INSERT INTO hosts (id, name, address) VALUES (1, 'Hotel Pet Alpha', 'Rua A, 123')");
      db.run("INSERT INTO hosts (id, name, address) VALUES (2, 'Pousada B', 'Rua B, 456')");

      // Reserva Histórica
      db.run("INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status) VALUES (1, 1, 1, '2026-01-01', '2026-01-05', 'completed')");

      resolve(db);
    });
  });
}

export { db };
