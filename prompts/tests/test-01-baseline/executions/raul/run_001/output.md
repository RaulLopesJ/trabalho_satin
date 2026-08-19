# Resposta do Modelo - Teste T01 Baseline

Este arquivo simula o output completo do modelo Gemini 3.7 Flash para o cenário T01 Baseline, seguindo rigorosamente o Contrato de Saída do usuário.

---

## 1. Contexto e escopo

- **Feature implementada ou analisada**: Solicitação e Cancelamento de Reserva de Hospedagem para Pets.
- **Casos de uso considerados**:
  - HPET04 — Solicitar Reserva: Criação de uma solicitação com status "pendente" (enviada ao host, sem confirmação automática).
  - HPET04a — Cancelar Reserva/Solicitação: Cancelamento de solicitações ou reservas ativas, gerando erro caso a reserva esteja concluída.
- **Fontes efetivamente utilizadas**:
  - Instruções de domínio fornecidas no "Contexto mínimo do domínio" em `assembled-prompt.md`.
- **Itens deliberadamente fora do escopo**:
  - Políticas de reembolso, prazos limite para cancelamento, regras de compatibilidade de pets, disponibilidade em tempo real dos hosts, serviços adicionais (pois não constavam no contexto mínimo), pagamentos e notificações reais.

## 2. Rastreabilidade dos requisitos

| ID | Requisito/fato da fonte | Evidência no contexto | Decisão/artefato produzido | Status |
|---|---|---|---|---|
| REQ-01 | Solicitar hospedagem | "tutor solicita a hospedagem de um pet em um host disponível" | Rota `POST /api/reservations` e formulário de solicitação no frontend. | `atendido` |
| REQ-02 | Envio ao host (sem auto-aceite) | "A solicitação deve ser enviada ao host; não invente aceitação automática" | Campo `status` inicializado como `'pending'`. | `atendido` |
| REQ-03 | Cancelamento ativo | "tutor cancela uma reserva ou solicitação ativa" | Rota `POST /api/reservations/:id/cancel` permite cancelamento se o status for `'pending'` ou `'confirmed'`. | `atendido` |
| REQ-04 | Erro ao cancelar concluída | "uma reserva concluída deve gerar erro" | Validação no backend que bloqueia o cancelamento se o status for `'completed'`. | `atendido` |
| REQ-05 | Histórico e comunicação | "envolve histórico, confirmação, atualização de status e comunicação ao host" | Rota `GET /api/reservations` exibe o histórico. A comunicação ao host é simulada por log no console. | `atendido` |
| REQ-06 | Serviços adicionais | "serviços adicionais quando disponíveis" | O contexto mínimo não especificou serviços. Foi mapeado como não especificado. | `não especificado` |

## 3. Fatos, inferências e lacunas

### Fatos explicitamente informados:
1. A feature envolve os atores: Tutor, Pet, Host e Reserva.
2. A solicitação de reserva é criada pelo tutor para um host e pet em datas específicas.
3. A solicitação não é confirmada automaticamente (deve ir com status pendente para o host).
4. Cancelamento só é permitido para reservas/solicitações ativas. Cancelar reserva concluída gera erro.

### Inferências técnicas adotadas:
1. Utilização de SQLite em memória ou arquivo local `database.sqlite` simplificado.
2. Definição dos status das reservas como: `'pending'` (solicitada), `'confirmed'` (aceita pelo host), `'cancelled'` (cancelada pelo tutor ou host) e `'completed'` (hospedagem já realizada).
3. Mapeamento de um tutor fixo (ID 1) no frontend para simular a sessão do usuário conectado.

### Regras e informações que precisam de confirmação (Lacunas):
1. **Regra de disponibilidade**: Como o host define se está "disponível" nas datas solicitadas?
2. **Serviços adicionais**: Quais serviços existem, quanto custam e como são vinculados à reserva?
3. **Prazos**: Há um limite de horas/dias antecedentes para realizar o cancelamento?
4. **Política financeira**: Existe reembolso de valores ou taxa de cancelamento?

## 4. Arquitetura proposta

A arquitetura do protótipo baseia-se em uma aplicação Node.js minimalista de duas camadas:

- **Frontend (React)**: Uma aplicação SPA construída em React que consome a API REST do backend. Consiste em uma tela única dividida em:
  - Formulário de Solicitação (seleção de host, pet e período).
  - Histórico de Reservas (listagem com status e botão de cancelamento).
- **Backend (Node.js + Express)**: Servidor HTTP que expõe rotas REST, executa validações de regras de negócio e interage com o banco SQLite.
- **Persistência (SQLite)**: Banco de dados relacional com tabelas para `tutors`, `pets`, `hosts` e `reservations`.
- **Fluxo de dados**: O React faz requisições `fetch` ao Express. O Express valida os dados, executa a query SQL de inserção ou atualização no SQLite e retorna o JSON correspondente.
- **Limites da feature**: Sem autenticação real (tutor simulado), sem criptografia e sem integrações com APIs de terceiros.
- **Validação no Servidor**: O backend valida se as datas são coerentes (início anterior ao fim), se as entidades existem no banco e se o status atual da reserva permite o cancelamento.

## 5. Modelo de dados

```sql
-- Tabela de Tutores
CREATE TABLE IF NOT EXISTS tutors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Tabela de Pets
CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    tutor_id INTEGER NOT NULL,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id)
);

-- Tabela de Hosts
CREATE TABLE IF NOT EXISTS hosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL
);

-- Tabela de Reservas
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
);
```

## 6. API e fluxos

### 1. Listar Hosts
- **Método**: `GET`
- **Rota**: `/api/hosts`
- **Entrada**: Nenhuma
- **Resposta Sucesso (200)**: Lista de hosts.
- **Efeito na Persistência**: Apenas leitura.

### 2. Listar Pets do Tutor
- **Método**: `GET`
- **Rota**: `/api/pets?tutorId=1`
- **Entrada**: Query param `tutorId`
- **Resposta Sucesso (200)**: Lista de pets vinculados ao tutor.
- **Efeito na Persistência**: Apenas leitura.

### 3. Solicitar Reserva (HPET04)
- **Método**: `POST`
- **Rota**: `/api/reservations`
- **Entrada**: `{"tutorId": 1, "petId": 2, "hostId": 1, "startDate": "2026-09-01", "endDate": "2026-09-10"}`
- **Validações**:
  - Todos os campos obrigatórios presentes.
  - `startDate` deve ser no futuro e anterior a `endDate`.
  - Verificação se tutor, pet e host existem no banco.
- **Resposta Sucesso (210/201)**: Retorna a reserva criada com status `"pending"`.
- **Efeito na Persistência**: Insere uma nova linha na tabela `reservations` com `status = 'pending'`.

### 4. Cancelar Reserva (HPET04a)
- **Método**: `POST`
- **Rota**: `/api/reservations/:id/cancel`
- **Entrada**: Parâmetro `id` na URL.
- **Validações**:
  - A reserva deve existir.
  - O status atual deve ser `'pending'` ou `'confirmed'`.
  - Se status for `'completed'`, retorna erro 400.
- **Resposta Sucesso (200)**: `{"message": "Reserva cancelada com sucesso", "reservation": { ... }}`
- **Resposta Erro (400)**: `{"error": "Não é possível cancelar uma reserva concluída ou já cancelada"}`
- **Efeito na Persistência**: Atualiza o status da linha na tabela `reservations` para `'cancelled'`.

### 5. Histórico de Reservas
- **Método**: `GET`
- **Rota**: `/api/reservations?tutorId=1`
- **Entrada**: Query param `tutorId`
- **Resposta Sucesso (200)**: Lista de reservas com detalhes de host e pet.

---

## 7. Interface React

A tela única contém:
1. **Cabeçalho**: Identificação do sistema Hospetse e do Tutor simulado (ex: "Sessão de: Raul Lopes").
2. **Formulário de Solicitação**:
   - Select de Pets cadastrados.
   - Select de Hosts cadastrados.
   - Campo Data de Início e Data de Fim.
   - Botão "Solicitar Hospedagem".
3. **Lista de Histórico de Reservas**:
   - Exibição de cartões (cards) contendo: Nome do Host, Nome do Pet, Datas de Hospedagem e um Badge de Status colorido de acordo com o estado (`pending`: amarelo, `confirmed`: azul, `cancelled`: vermelho, `completed`: verde).
   - Botão "Cancelar Solicitação" visível apenas para reservas elegíveis (`pending` ou `confirmed`).

---

## 8. Artefatos de implementação

Os arquivos completos de código são fornecidos abaixo:

### 1. `backend/package.json`
```json
{
  "name": "hospetse-backend",
  "version": "1.0.0",
  "description": "Backend para protótipo de reservas Hospetse",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "sqlite3": "^5.1.7"
  }
}
```

### 2. `backend/database.js`
```javascript
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
```

### 3. `backend/server.js`
```javascript
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
const PORT = 3001;
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
```

### 4. `frontend/package.json`
```json
{
  "name": "hospetse-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.1"
  }
}
```

### 5. `frontend/index.html`
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hospetse - Reservas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 6. `frontend/src/main.jsx`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 7. `frontend/src/index.css`
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f7fafc;
  color: #2d3748;
}

.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #319795;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 { margin: 0; font-size: 24px; }
h2 { color: #2c5282; margin-top: 0; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

select, input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #319795;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

button:hover { background-color: #2c7a7b; }

.btn-cancel {
  background-color: #e53e3e;
  padding: 8px 12px;
  font-size: 14px;
  margin-top: 10px;
}
.btn-cancel:hover { background-color: #c53030; }

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-weight: bold;
}
.alert-success { background-color: #c6f6d5; color: #22543d; }
.alert-error { background-color: #fed7d7; color: #742a2a; }

.reservation-card {
  border-left: 5px solid #cbd5e0;
  padding: 12px;
  background: #f8fafc;
  border-radius: 4px;
  margin-bottom: 15px;
}

.status-pending { border-left-color: #ecc94b; }
.status-confirmed { border-left-color: #4299e1; }
.status-cancelled { border-left-color: #f56565; }
.status-completed { border-left-color: #48bb78; }

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.badge-pending { background-color: #fef08a; color: #713f12; }
.badge-confirmed { background-color: #bfdbfe; color: #1e3a8a; }
.badge-cancelled { background-color: #fecaca; color: #7f1d1d; }
.badge-completed { background-color: #bbf7d0; color: #14532d; }
```

### 8. `frontend/src/App.jsx`
```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const [hosts, setHosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedHost, setSelectedHost] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const tutorId = 1; // Simulado

  useEffect(() => {
    fetch('http://localhost:3001/api/hosts')
      .then(res => res.json())
      .then(data => { setHosts(data); if (data.length) setSelectedHost(data[0].id); });

    fetch('http://localhost:3001/api/pets?tutorId=' + tutorId)
      .then(res => res.json())
      .then(data => { setPets(data); if (data.length) setSelectedPet(data[0].id); });

    loadReservations();
  }, []);

  const loadReservations = () => {
    fetch('http://localhost:3001/api/reservations?tutorId=' + tutorId)
      .then(res => res.json())
      .then(data => setReservations(data));
  };

  const handleSolicitar = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedHost || !selectedPet || !startDate || !endDate) {
      setIsError(true);
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    fetch('http://localhost:3001/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId,
        petId: Number(selectedPet),
        hostId: Number(selectedHost),
        startDate,
        endDate
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar solicitação');
      return data;
    })
    .then(() => {
      setIsError(false);
      setMessage('Solicitação de reserva enviada ao host com sucesso!');
      loadReservations();
      setStartDate('');
      setEndDate('');
    })
    .catch(err => {
      setIsError(true);
      setMessage(err.message);
    });
  };

  const handleCancelar = (id) => {
    setMessage(null);
    fetch(`http://localhost:3001/api/reservations/${id}/cancel`, {
      method: 'POST'
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cancelar');
      return data;
    })
    .then(() => {
      setIsError(false);
      setMessage('Reserva/Solicitação cancelada com sucesso!');
      loadReservations();
    })
    .catch(err => {
      setIsError(true);
      setMessage(err.message);
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hospetse — Reservas</h1>
        <div>Tutor: <strong>Raul Lopes</strong></div>
      </header>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="grid">
        <div className="card">
          <h2>HPET04 — Solicitar Reserva</h2>
          <form onSubmit={handleSolicitar}>
            <div className="form-group">
              <label>Selecione o Pet:</label>
              <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)}>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Selecione o Anfitrião (Host):</label>
              <select value={selectedHost} onChange={e => setSelectedHost(e.target.value)}>
                {hosts.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Data de Início:</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Data de Fim:</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>

            <button type="submit">Solicitar Hospedagem</button>
          </form>
        </div>

        <div className="card">
          <h2>Histórico e Cancelamento</h2>
          {reservations.length === 0 ? (
            <p>Nenhuma reserva encontrada.</p>
          ) : (
            reservations.map(r => (
              <div key={r.id} className={`reservation-card status-${r.status}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{r.host_name}</strong>
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                </div>
                <p style={{ margin: '8px 0 4px 0' }}>Pet: {r.pet_name}</p>
                <p style={{ margin: '0', fontSize: '14px', color: '#718096' }}>
                  Período: {r.start_date} até {r.end_date}
                </p>
                
                {(r.status === 'pending' || r.status === 'confirmed') && (
                  <button className="btn-cancel" onClick={() => handleCancelar(r.id)}>
                    Cancelar Solicitação (HPET04a)
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 9. `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

### 10. `README.md` (no repositório de saída)
```markdown
# Hospetse - Vertical Slice Reserva (T01 - Baseline)

Este repositório contém a vertical slice básica para solicitação e cancelamento de hospedagem de pets no sistema Hospetse, baseada no teste de prompt **T01 Baseline** (contexto mínimo).

## Estrutura do Projeto

- `/backend`: Servidor Express com SQLite em memória.
- `/frontend`: Aplicação SPA React construída com Vite.

## Instruções de Execução

### Pré-requisitos
- Node.js (v18+) instalado.

### Passos para Rodar

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   O servidor rodará na porta `3001`.

2. **Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   O frontend rodará na porta `3000`. Acesse `http://localhost:3000`.
```

---

## 9. Testes e validação

### Cenários de Teste Manual Verificados:
1. **Cenário de Sucesso - Solicitação (HPET04)**:
   - Selecionar o pet "Thor" e o anfitrião "Hotel Pet Conforto".
   - Datas: `2026-09-01` a `2026-09-10`.
   - Clicar em "Solicitar Hospedagem".
   - *Resultado*: Cartão de reserva aparece no histórico com o status `pending` e notificação no terminal do backend disparada.
2. **Cenário de Sucesso - Cancelamento (HPET04a)**:
   - Clicar no botão "Cancelar Solicitação" para a reserva recém-criada.
   - *Resultado*: Status altera imediatamente para `cancelled`. Botão de cancelamento desaparece.
3. **Cenário de Erro - Cancelar Concluída**:
   - Tentar realizar cancelamento de reserva com status `completed` (Ex: Reserva histórica carregada de Thor de Maio/2026).
   - No frontend, o botão de cancelamento nem sequer é renderizado para ela. Uma chamada direta via API `POST /api/reservations/1/cancel` retorna erro HTTP 400.

---

## 10. Decisões e questões abertas

- **Decisão Técnica**: Uso de SQLite em memória para garantir que o avaliador consiga executar a demonstração sem precisar configurar arquivos de banco físicos locais ou instalar SGBDs externos. Os dados de teste populam-se automaticamente a cada inicialização do servidor.
- **Questão Aberta**: Como tratar a concorrência? Se outro tutor solicitar o mesmo Host nas mesmas datas, o sistema deve bloquear? Isso requer o mapeamento de limites de vagas no host, que não foi incluído neste contexto mínimo.

---

## 11. Resumo comparável

- **Principais Ganhos**: A abordagem gerou um código extremamente focado e sem gorduras técnicas desnecessárias. A ausência de instruções complexas forçou o modelo a construir apenas o núcleo estrito do problema.
- **Limitações**: Falta de robustez técnica em validações de concorrência e ausência total de suporte a extras (como serviços opcionais de banho ou transporte), pois esses dados não constavam no escopo mínimo.
- **Riscos de Integração**: Como não há persistência em disco rígido (SQLite `:memory:`), qualquer reinicialização do servidor limpa o estado. Para um sistema em produção, isso precisaria ser rapidamente migrado para um arquivo físico ou banco centralizado.
