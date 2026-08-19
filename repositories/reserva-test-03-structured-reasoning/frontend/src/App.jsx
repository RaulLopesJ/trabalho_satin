import React, { useState, useEffect } from 'react';

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

function App() {
  const [hosts, setHosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedHost, setSelectedHost] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/hosts`).then(res => res.json()).then(setHosts);
    fetch(`${API_URL}/pets`).then(res => res.json()).then(setPets);
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    fetch(`${API_URL}/reservations`).then(res => res.json()).then(setReservations);
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId: selectedHost, petId: selectedPet, startDate, endDate })
    });
    if (res.ok) {
      setMessage('Reserva solicitada com sucesso!');
      fetchReservations();
    } else {
      const data = await res.json();
      setMessage(`Erro: ${data.error}`);
    }
  };

  const handleCancel = async (id) => {
    const res = await fetch(`${API_URL}/reservations/${id}/cancel`, { method: 'POST' });
    if (res.ok) {
      setMessage('Reserva cancelada!');
      fetchReservations();
    } else {
      const data = await res.json();
      setMessage(`Erro: ${data.error}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Hospetse - Reserva de Pets</h1>
      
      {message && <div style={{ padding: '10px', backgroundColor: '#eee', marginBottom: '10px' }}>{message}</div>}

      <section>
        <h2>Nova Reserva (HPET04)</h2>
        <form onSubmit={handleReserve}>
          <div>
            <label>Pet: </label>
            <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)} required>
              <option value="">Selecione um pet</option>
              {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label>Host: </label>
            <select value={selectedHost} onChange={e => setSelectedHost(e.target.value)} required>
              <option value="">Selecione um host</option>
              {hosts.map(h => <option key={h.id} value={h.id}>{h.name} - R${h.price_per_night}/noite</option>)}
            </select>
          </div>
          <div>
            <label>Início: </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label>Fim: </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
          <button type="submit">Solicitar Reserva</button>
        </form>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Minhas Reservas (HPET04a)</h2>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pet</th>
              <th>Host</th>
              <th>Datas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.pet_name}</td>
                <td>{r.host_name}</td>
                <td>{r.start_date} até {r.end_date}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === 'pending' && <button onClick={() => handleCancel(r.id)}>Cancelar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
