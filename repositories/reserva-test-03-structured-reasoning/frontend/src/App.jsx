import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

function App() {
  const [hosts, setHosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedHost, setSelectedHost] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetch(`${API_URL}/hosts`)
      .then(res => res.json())
      .then(setHosts)
      .catch(err => showMsg('Erro ao carregar hosts', 'error'));

    fetch(`${API_URL}/pets`)
      .then(res => res.json())
      .then(setPets)
      .catch(err => showMsg('Erro ao carregar pets', 'error'));

    fetchReservations();
  }, []);

  const fetchReservations = () => {
    fetch(`${API_URL}/reservations`)
      .then(res => res.json())
      .then(setReservations)
      .catch(err => showMsg('Erro ao carregar histórico', 'error'));
  };

  const showMsg = (text, type) => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 5000);
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostId: selectedHost, petId: selectedPet, startDate, endDate })
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('Solicitação de reserva enviada com sucesso ao host!', 'success');
        setSelectedHost('');
        setSelectedPet('');
        setStartDate('');
        setEndDate('');
        fetchReservations();
      } else {
        showMsg(`Erro: ${data.error}`, 'error');
      }
    } catch (err) {
      showMsg('Erro de conexão ao tentar reservar.', 'error');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reservations/${id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showMsg('Sua solicitação foi cancelada e o anfitrião foi notificado.', 'success');
        fetchReservations();
      } else {
        showMsg(`Erro ao cancelar: ${data.error}`, 'error');
      }
    } catch (err) {
      showMsg('Erro de conexão ao tentar cancelar.', 'error');
    }
  };

  return (
    <div>
      <header>
        <h1>Hospetse</h1>
        <p>Vertical Slice de Reserva de Hospedagens para Pets — Tutor: Raul Silva</p>
      </header>

      {statusMsg.text && (
        <div className={`alert alert-${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <div className="grid-container">
        {/* Formulário - HPET04 */}
        <div className="card">
          <h2>Solicitar Hospedagem</h2>
          <form onSubmit={handleReserve}>
            <div className="form-group">
              <label htmlFor="pet">Selecione seu Pet</label>
              <select
                id="pet"
                className="form-control"
                value={selectedPet}
                onChange={e => setSelectedPet(e.target.value)}
                required
              >
                <option value="">-- Selecione --</option>
                {pets.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="host">Selecione o Anfitrião (Host)</label>
              <select
                id="host"
                className="form-control"
                value={selectedHost}
                onChange={e => setSelectedHost(e.target.value)}
                required
              >
                <option value="">-- Selecione --</option>
                {hosts.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} — R$ {h.price_per_night.toFixed(2)}/noite
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="start">Data de Check-in</label>
              <input
                id="start"
                type="date"
                className="form-control"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end">Data de Check-out</label>
              <input
                id="end"
                type="date"
                className="form-control"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>

            <button type="submit">Enviar Solicitação</button>
          </form>
        </div>

        {/* Histórico — HPET04a */}
        <div className="card">
          <h2>Seu Histórico de Solicitações</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Pet</th>
                  <th>Datas</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                      Nenhuma reserva encontrada.
                    </td>
                  </tr>
                ) : (
                  reservations.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.host_name}</strong></td>
                      <td>{r.pet_name}</td>
                      <td style={{ fontSize: '13px' }}>
                        {r.start_date} <br/>até {r.end_date}
                      </td>
                      <td>
                        <span className={`badge badge-${r.status}`}>
                          {r.status === 'pending' ? 'Pendente' : r.status === 'cancelled' ? 'Cancelado' : r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'pending' && (
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => handleCancel(r.id)}
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
