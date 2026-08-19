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
    fetch('/api/hosts')
      .then(res => res.json())
      .then(data => { setHosts(data); if (data.length) setSelectedHost(data[0].id); });

    fetch('/api/pets?tutorId=' + tutorId)
      .then(res => res.json())
      .then(data => { setPets(data); if (data.length) setSelectedPet(data[0].id); });

    loadReservations();
  }, []);

  const loadReservations = () => {
    fetch('/api/reservations?tutorId=' + tutorId)
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

    fetch('/api/reservations', {
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
    fetch(`/api/reservations/${id}/cancel`, {
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
