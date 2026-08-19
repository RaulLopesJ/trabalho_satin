const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { runAsync, allAsync, getAsync } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes

// 1. Get all Tutors
app.get('/api/tutors', async (req, res) => {
  try {
    const tutors = await allAsync("SELECT * FROM tutors");
    res.json(tutors);
  } catch (err) {
    res.status(500).json({ error: "Algo deu errado", message: "Erro ao buscar tutores." });
  }
});

// 2. Get Tutor Pets
app.get('/api/tutors/:id/pets', async (req, res) => {
  try {
    const pets = await allAsync("SELECT * FROM pets WHERE tutor_id = ?", [req.params.id]);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: "Algo deu errado", message: "Erro ao buscar pets do tutor." });
  }
});

// 3. Get all Hosts
app.get('/api/hosts', async (req, res) => {
  try {
    const hosts = await allAsync("SELECT * FROM hosts");
    // Attach services and unavailability for convenience
    for (let host of hosts) {
      host.services = await allAsync("SELECT * FROM services WHERE host_id = ?", [host.id]);
      host.unavailability = await allAsync("SELECT * FROM host_unavailability WHERE host_id = ?", [host.id]);
    }
    res.json(hosts);
  } catch (err) {
    res.status(500).json({ error: "Algo deu errado", message: "Erro ao buscar anfitriões." });
  }
});

// 4. Get Host Services
app.get('/api/hosts/:id/services', async (req, res) => {
  try {
    const services = await allAsync("SELECT * FROM services WHERE host_id = ?", [req.params.id]);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Algo deu errado", message: "Erro ao buscar serviços." });
  }
});

// 5. Get Reservation History for Tutor
app.get('/api/tutors/:id/reservations', async (req, res) => {
  try {
    const query = `
      SELECT r.*, h.name as host_name, p.name as pet_name
      FROM reservations r
      JOIN hosts h ON r.host_id = h.id
      JOIN pets p ON r.pet_id = p.id
      WHERE r.tutor_id = ?
      ORDER BY r.id DESC
    `;
    const reservations = await allAsync(query, [req.params.id]);
    
    // For each reservation, get selected services
    for (let r of reservations) {
      r.services = await allAsync(`
        SELECT s.* 
        FROM services s
        JOIN reservation_services rs ON s.id = rs.service_id
        WHERE rs.reservation_id = ?
      `, [r.id]);
    }
    
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Algo deu errado", message: "Erro ao buscar histórico de reservas." });
  }
});

// Helper function to calculate date difference in days
function getDaysDifference(start, end) {
  const sDate = new Date(start);
  const eDate = new Date(end);
  const diffTime = Math.abs(eDate - sDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  return diffDays;
}

// 6. Create Reservation (HPET04 — Solicitar Reserva)
app.post('/api/reservations', async (req, res) => {
  const { tutor_id, pet_id, host_id, start_date, end_date, service_ids = [] } = req.body;

  // Fluxo Alternativo: Campo não preenchido corretamente
  if (!tutor_id || !pet_id || !host_id || !start_date || !end_date) {
    return res.status(400).json({
      error: "Campos inválidos",
      message: "Por favor, preencha todos os campos obrigatórios corretamente."
    });
  }

  try {
    // Fetch Pet & Host for compatibility check
    const pet = await getAsync("SELECT * FROM pets WHERE id = ?", [pet_id]);
    const host = await getAsync("SELECT * FROM hosts WHERE id = ?", [host_id]);

    if (!pet || !host) {
      return res.status(404).json({
        error: "Não encontrado",
        message: "Pet ou Host não localizado no banco de dados."
      });
    }

    // Check compatibility: Species and Size
    const acceptedSpecies = host.accepted_species.split(',').map(s => s.trim().toLowerCase());
    const acceptedSizes = host.accepted_sizes.split(',').map(s => s.trim().toLowerCase());

    const isSpeciesCompatible = acceptedSpecies.includes(pet.species.toLowerCase());
    const isSizeCompatible = acceptedSizes.includes(pet.size.toLowerCase());

    // Fluxo Alternativo: Pet não permitido
    if (!isSpeciesCompatible || !isSizeCompatible) {
      return res.status(400).json({
        error: "Pet não permitido",
        message: "Infelizmente este anfitrião não aceita gatos/cães de grande porte."
      });
    }

    // Check host unavailability for selected dates
    // Date conflict 1: specific host_unavailability
    const unavailabilityConflict = await getAsync(`
      SELECT * FROM host_unavailability 
      WHERE host_id = ? 
      AND (date BETWEEN ? AND ?)
    `, [host_id, start_date, end_date]);

    // Date conflict 2: overlapping active reservations
    const overlappingReservation = await getAsync(`
      SELECT * FROM reservations
      WHERE host_id = ?
      AND status IN ('Pendente', 'Confirmada')
      AND NOT (end_date < ? OR start_date > ?)
    `, [host_id, start_date, end_date]);

    // Fluxo Alternativo: Data indisponível
    if (unavailabilityConflict || overlappingReservation) {
      return res.status(400).json({
        error: "Data indisponível",
        message: "Infelizmente o hotel não está disponível nos na data selecionada."
      });
    }

    // Calculate Price (Assumption: host base price of R$ 50.00/day + services price)
    const days = getDaysDifference(start_date, end_date);
    const baseRatePerDay = 50.00;
    let totalServicesPrice = 0.0;

    const servicesList = [];
    if (service_ids.length > 0) {
      const placeholders = service_ids.map(() => '?').join(',');
      const selectedServices = await allAsync(`
        SELECT * FROM services 
        WHERE id IN (${placeholders}) AND host_id = ?
      `, [...service_ids, host_id]);
      
      selectedServices.forEach(s => {
        totalServicesPrice += s.price;
        servicesList.push(s);
      });
    }

    const total_price = (baseRatePerDay * days) + totalServicesPrice;

    // Insert Reservation (status must be 'Pendente' as request is sent to host, not auto-accepted)
    const result = await runAsync(`
      INSERT INTO reservations (tutor_id, pet_id, host_id, start_date, end_date, status, total_price)
      VALUES (?, ?, ?, ?, ?, 'Pendente', ?)
    `, [tutor_id, pet_id, host_id, start_date, end_date, total_price]);

    const reservationId = result.id;

    // Insert Reservation Services
    for (let service of servicesList) {
      await runAsync(`
        INSERT INTO reservation_services (reservation_id, service_id)
        VALUES (?, ?)
      `, [reservationId, service.id]);
    }

    res.status(201).json({
      message: "Solicitação enviada com sucesso!",
      reservation_id: reservationId,
      total_price
    });

  } catch (err) {
    console.error("Erro ao criar reserva:", err);
    // Fluxo Alternativo: Algo deu errado
    res.status(500).json({
      error: "Algo deu errado",
      message: "Não conseguimos processar sua solicitação no momento. Tente novamente mais tarde."
    });
  }
});

// 7. Cancel Reservation (HPET04a — Cancelar Reserva/Solicitação)
app.post('/api/reservations/:id/cancel', async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await getAsync("SELECT * FROM reservations WHERE id = ?", [reservationId]);

    if (!reservation) {
      return res.status(404).json({
        error: "Não encontrado",
        message: "Solicitação de reserva não localizada."
      });
    }

    // Fluxo Alternativo: Reserva já concluída
    if (reservation.status === 'Concluída') {
      return res.status(400).json({
        error: "Erro ao cancelar",
        message: "Reserva já concluída não pode ser cancelada."
      });
    }

    // If already cancelled
    if (reservation.status === 'Cancelada') {
      return res.status(400).json({
        error: "Erro ao cancelar",
        message: "Esta solicitação/reserva já foi cancelada anteriormente."
      });
    }

    // Update status to 'Cancelada'
    await runAsync("UPDATE reservations SET status = 'Cancelada' WHERE id = ?", [reservationId]);

    res.json({
      message: "Cancelamento realizado com sucesso! O anfitrião foi notificado.",
      reservation_id: reservationId,
      status: 'Cancelada'
    });

  } catch (err) {
    console.error("Erro ao cancelar reserva:", err);
    res.status(500).json({
      error: "Algo deu errado",
      message: "Não conseguimos processar sua solicitação no momento. Tente novamente mais tarde."
    });
  }
});

// Serve frontend build if exists (standard full-stack production serving)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`Serving static files from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  
  // Direct all non-API GET requests to index.html for React SPA Routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
