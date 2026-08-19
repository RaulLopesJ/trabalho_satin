import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

export const db = new sqlite3.Database(dbPath);

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de Tutores
      db.run(`CREATE TABLE IF NOT EXISTS tutors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`);

      // Tabela de Pets
      db.run(`CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutor_id INTEGER,
        name TEXT NOT NULL,
        species TEXT,
        FOREIGN KEY (tutor_id) REFERENCES tutors (id)
      )`);

      // Tabela de Hosts (Hotéis/Anfitriões)
      db.run(`CREATE TABLE IF NOT EXISTS hosts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price_per_night REAL
      )`);

      // Tabela de Reservas
      db.run(`CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutor_id INTEGER,
        pet_id INTEGER,
        host_id INTEGER,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (tutor_id) REFERENCES tutors (id),
        FOREIGN KEY (pet_id) REFERENCES pets (id),
        FOREIGN KEY (host_id) REFERENCES hosts (id)
      )`);

      // Dados de Demonstração (Seed)
      db.get("SELECT count(*) as count FROM tutors", (err, row) => {
        if (row.count === 0) {
          db.run("INSERT INTO tutors (name) VALUES ('Raul Silva')");
          db.run("INSERT INTO pets (tutor_id, name, species) VALUES (1, 'Thor', 'Cachorro')");
          db.run("INSERT INTO hosts (name, description, price_per_night) VALUES ('Hotel Pet Feliz', 'O melhor descanso para seu pet', 80.00)");
          db.run("INSERT INTO hosts (name, description, price_per_night) VALUES ('Sítio do Totó', 'Amplo espaço verde e recreação', 120.00)");
          console.log('Banco de dados populado com dados de demonstração.');
        }
        resolve();
      });
    });
  });
};
