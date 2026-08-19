const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper function to run a query and return a Promise
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// Helper function to get all rows
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Helper function to get a single row
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Initialize tables and seed data, returning a Promise
let dbInitPromise = new Promise((resolve, reject) => {
  db.serialize(() => {
    // Create Tables
    db.run(`
      CREATE TABLE IF NOT EXISTS tutors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutor_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        size TEXT NOT NULL,
        FOREIGN KEY (tutor_id) REFERENCES tutors (id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS hosts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        accepted_species TEXT NOT NULL,
        accepted_sizes TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS host_unavailability (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (host_id) REFERENCES hosts (id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (host_id) REFERENCES hosts (id) ON DELETE CASCADE
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
        status TEXT NOT NULL DEFAULT 'Pendente',
        total_price REAL NOT NULL,
        FOREIGN KEY (tutor_id) REFERENCES tutors (id),
        FOREIGN KEY (pet_id) REFERENCES pets (id),
        FOREIGN KEY (host_id) REFERENCES hosts (id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS reservation_services (
        reservation_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        PRIMARY KEY (reservation_id, service_id),
        FOREIGN KEY (reservation_id) REFERENCES reservations (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
      )
    `);

    // Check if seeding is needed
    db.get("SELECT COUNT(*) as count FROM tutors", async (err, row) => {
      if (err) {
        console.error("Erro ao verificar dados existentes:", err);
        reject(err);
        return;
      }
      
      if (row.count === 0) {
        console.log("Banco de dados vazio. Semeando dados iniciais...");
        try {
          // 1. Tutors
          await runAsync("INSERT INTO tutors (name, email) VALUES (?, ?)", ["Raul Silveira", "raul@email.com"]);
          await runAsync("INSERT INTO tutors (name, email) VALUES (?, ?)", ["Pedro Satin", "pedro@email.com"]);

          // 2. Pets
          await runAsync("INSERT INTO pets (tutor_id, name, species, size) VALUES (?, ?, ?, ?)", [1, "Thor", "Cão", "Grande"]);
          await runAsync("INSERT INTO pets (tutor_id, name, species, size) VALUES (?, ?, ?, ?)", [1, "Mingau", "Gato", "Pequeno"]);
          await runAsync("INSERT INTO pets (tutor_id, name, species, size) VALUES (?, ?, ?, ?)", [2, "Luna", "Cão", "Pequeno"]);

          // 3. Hosts
          await runAsync("INSERT INTO hosts (name, accepted_species, accepted_sizes) VALUES (?, ?, ?)", 
            ["Hotel Canino Feliz", "Cão", "Pequeno,Médio"]);
          await runAsync("INSERT INTO hosts (name, accepted_species, accepted_sizes) VALUES (?, ?, ?)", 
            ["Gato Resort Spa", "Gato", "Pequeno,Médio,Grande"]);
          await runAsync("INSERT INTO hosts (name, accepted_species, accepted_sizes) VALUES (?, ?, ?)", 
            ["Anfitrião Amigo de Todos", "Cão,Gato", "Pequeno,Médio,Grande"]);

          // 4. Services
          await runAsync("INSERT INTO services (host_id, name, price) VALUES (?, ?, ?)", [1, "Banho e Tosa", 50.0]);
          await runAsync("INSERT INTO services (host_id, name, price) VALUES (?, ?, ?)", [1, "Passeio Monitorado", 30.0]);
          await runAsync("INSERT INTO services (host_id, name, price) VALUES (?, ?, ?)", [2, "Escovação Relaxante", 40.0]);
          await runAsync("INSERT INTO services (host_id, name, price) VALUES (?, ?, ?)", [2, "Sachê Premium", 15.0]);
          await runAsync("INSERT INTO services (host_id, name, price) VALUES (?, ?, ?)", [3, "Adestramento Básico", 100.0]);
          await runAsync("INSERT INTO services (host_id, name, price) VALUES (?, ?, ?)", [3, "Escovação Higiênica", 35.0]);

          // 5. Host Unavailability
          await runAsync("INSERT INTO host_unavailability (host_id, date) VALUES (?, ?)", [3, "2026-12-25"]);

          // 6. Pre-existing reservations
          await runAsync("INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [1, 2, 2, "2026-09-01", "2026-09-05", "Confirmada", 60.0]);
          await runAsync("INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [2, 3, 1, "2026-08-10", "2026-08-12", "Concluída", 100.0]);
          await runAsync("INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [1, 1, 3, "2026-11-01", "2026-11-03", "Pendente", 200.0]);

          console.log("Banco de dados semeado com sucesso!");
          resolve();
        } catch (err) {
          console.error("Erro ao semear o banco de dados:", err);
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
});

module.exports = {
  db,
  runAsync,
  allAsync,
  getAsync,
  dbInitPromise
};
