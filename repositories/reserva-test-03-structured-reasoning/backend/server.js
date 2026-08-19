import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, db } from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// Servir frontend em produção
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// API: Listar Hosts
app.get('/api/hosts', (req, res) => {
  db.all('SELECT * FROM hosts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Listar Pets
app.get('/api/pets', (req, res) => {
  const tutorId = 1; // Simulado
  db.all('SELECT * FROM pets WHERE tutor_id = ?', [tutorId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Listar Reservas
app.get('/api/reservations', (req, res) => {
  const tutorId = 1; // Simulado
  const sql = `
    SELECT r.*, h.name as host_name, p.name as pet_name 
    FROM reservations r
    JOIN hosts h ON r.host_id = h.id
    JOIN pets p ON r.pet_id = p.id
    WHERE r.tutor_id = ?
    ORDER BY r.id DESC
  `;
  db.all(sql, [tutorId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Solicitar Reserva (HPET04)
app.post('/api/reservations', (req, res) => {
  const { petId, hostId, startDate, endDate } = req.body;
  const tutorId = 1; // Simulado

  if (!petId || !hostId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Dados incompletos para a reserva.' });
  }

  const sql = `INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [tutorId, petId, hostId, startDate, endDate], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    console.log(`[NOTIFICAÇÃO] Nova reserva #${this.lastID} solicitada ao host ${hostId}`);
    res.status(201).json({ id: this.lastID, status: 'pending' });
  });
});

// API: Cancelar Reserva (HPET04a)
app.post('/api/reservations/:id/cancel', (req, res) => {
  const reservationId = req.params.id;

  db.get('SELECT status FROM reservations WHERE id = ?', [reservationId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Reserva não encontrada.' });

    if (row.status === 'completed') {
      return res.status(400).json({ error: 'Não é possível cancelar uma reserva já concluída.' });
    }

    db.run('UPDATE reservations SET status = "cancelled" WHERE id = ?', [reservationId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(`[NOTIFICAÇÃO] Reserva #${reservationId} foi cancelada.`);
      res.json({ message: 'Reserva cancelada com sucesso.' });
    });
  });
});

// Fallback para o frontend SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
