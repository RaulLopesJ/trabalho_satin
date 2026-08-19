import React, { useState, useEffect } from 'react';

function App() {
  const [hosts, setHosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ hostId: '', petId: '', startDate: '', endDate: '' });
  const [msg, setMsg] = useState('');

  const tutorId = 1;

  useEffect(() => {
    fetch('http://localhost:3001/api/hosts').then(r => r.json()).then(setHosts);
    fetch('http://localhost:3001/api/pets').then(r => r.json()).then(setPets);
    loadReservations();
  }, []);

  const loadReservations = () => {
    fetch('http://localhost:3001/api/reservations').then(r => r.json()).then(setReservations);
  };

  const handleSolicitar = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tutorId })
    })
    .then(r => r.json())
    .then(data => {
      if (data.error) setMsg('Erro: ' + data.error);
      else { setMsg('Sucesso!'); loadReservations(); }
    });
  };

  const handleCancelar = (id) => {
    fetch(`http://localhost:3001/api/reservations/${id}/cancel`, { method: 'POST' })
    .then(r => r.json())
    .then(data => {
      if (data.error) setMsg('Erro: ' + data.error);
      else { setMsg('Cancelado!'); loadReservations(); }
    });
  };

  return (
    <div className="container">
      <h1>Hospetse - Reservas (T02)</h1>
      {msg && <div className="card">{msg}</div>}

      <div className="card">
        <h2>Solicitar Reserva</h2>
        <form onSubmit={handleSolicitar}>
          <select onChange={e => setForm({...form, petId: e.target.value})}>
            <option value="">Selecione o Pet</option>
            {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select onChange={e => setForm({...form, hostId: e.target.value})}>
            <option value="">Selecione o Host</option>
            {hosts.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <input type="date" onChange={e => setForm({...form, startDate: e.target.value})} />
          <input type="date" onChange={e => setForm({...form, endDate: e.target.value})} />
          <button className="btn btn-primary" type="submit">Solicitar</button>
        </form>
      </div>

      <div className="card">
        <h2>Histórico</h2>
        {reservations.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            {r.host_name} - {r.pet_name} ({r.start_date} a {r.end_date})
            <span className={`status status-${r.status}`}> [{r.status}] </span>
            {(r.status === 'pending' || r.status === 'confirmed') && (
              <button className="btn btn-danger" onClick={() => handleCancelar(r.id)}>Cancelar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
