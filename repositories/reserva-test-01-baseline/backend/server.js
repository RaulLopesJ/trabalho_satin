import express from 'express';
import cors from 'cors';
import { initDatabase, db } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

// Listar Hosts
app.get('/api/hosts', (req, res) => {
  db.all('SELECT * FROM hosts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar Pets do Tutor
app.get('/api/pets', (req, res) => {
  const tutorId = req.query.tutorId || 1;
  db.all('SELECT * FROM pets WHERE tutor_id = ?', [tutorId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar Reservas (Histórico)
app.get('/api/reservations', (req, res) => {
  const tutorId = req.query.tutorId || 1;
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

// Solicitar Reserva (HPET04)
app.post('/api/reservations', (req, res) => {
  const { tutorId, petId, hostId, startDate, endDate } = req.body;

  if (!tutorId || !petId || !hostId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // Validação simples de datas
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ error: 'A data de fim deve ser posterior à data de início' });
  }

  const sql = `
    INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;
  
  db.run(sql, [tutorId, petId, hostId, startDate, endDate], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Simular Comunicação ao Host por Log
    console.log(`[NOTIFICAÇÃO HOST] Nova solicitação enviada para o Host ID ${hostId}. ID Reserva: ${this.lastID}`);

    res.status(201).json({
      id: this.lastID,
      tutor_id: tutorId,
      pet_id: petId,
      host_id: hostId,
      start_date: startDate,
      end_date: endDate,
      status: 'pending'
    });
  });
});

// Cancelar Reserva/Solicitação (HPET04a)
app.post('/api/reservations/:id/cancel', (req, res) => {
  const reservationId = req.params.id;

  db.get('SELECT * FROM reservations WHERE id = ?', [reservationId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Reserva não encontrada' });

    // Bloquear se estiver concluída
    if (row.status === 'completed') {
      return res.status(400).json({ error: 'Não é possível cancelar uma hospedagem já concluída' });
    }

    // Bloquear se já estiver cancelada
    if (row.status === 'cancelled') {
      return res.status(400).json({ error: 'Esta reserva já foi cancelada' });
    }

    db.run('UPDATE reservations SET status = ? WHERE id = ?', ['cancelled', reservationId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Simular Comunicação ao Host
      console.log(`[NOTIFICAÇÃO HOST] Cancelamento de Reserva efetuado. ID Reserva: ${reservationId}`);

      res.json({ message: 'Reserva cancelada com sucesso', id: reservationId, status: 'cancelled' });
    });
  });
});

// Inicializar banco e depois escutar
const PORT = Number(process.env.PORT) || 3001;
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
