import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:'); // Rodando em memória para protótipo reproduzível

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Criar Tabelas
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

      // Popular dados de demonstração
      db.run("INSERT INTO tutors (id, name, email) VALUES (1, 'Raul Lopes', 'raul@hospetse.com.br')");
      db.run("INSERT INTO pets (id, name, type, tutor_id) VALUES (1, 'Thor', 'Cachorro', 1)");
      db.run("INSERT INTO pets (id, name, type, tutor_id) VALUES (2, 'Mel', 'Gato', 1)");

      db.run("INSERT INTO hosts (id, name, address) VALUES (1, 'Hotel Pet Conforto', 'Rua das Flores, 123')");
      db.run("INSERT INTO hosts (id, name, address) VALUES (2, 'Sítio Recanto dos Pets', 'Estrada Verde, Km 10')");

      // Inserir algumas reservas históricas para validação
      db.run("INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status) VALUES (1, 1, 1, '2026-05-01', '2026-05-05', 'completed')");
      db.run("INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status) VALUES (1, 2, 2, '2026-09-10', '2026-09-15', 'pending')");

      resolve(db);
    });
  });
}

export { db };
