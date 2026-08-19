import React, { useState, useEffect } from 'react';

function App() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [hosts, setHosts] = useState([]);
  const [selectedHostId, setSelectedHostId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [history, setHistory] = useState([]);
  
  // UI States
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger' | 'warning', title?: string, message: string }
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial tutors and hosts
  useEffect(() => {
    fetchTutors();
    fetchHosts();
  }, []);

  // Fetch pets and reservation history when selected tutor changes
  useEffect(() => {
    if (selectedTutorId) {
      fetchPets(selectedTutorId);
      fetchHistory(selectedTutorId);
      // Reset pet selection
      setSelectedPetId('');
    } else {
      setPets([]);
      setHistory([]);
    }
  }, [selectedTutorId]);

  // Reset selected services when host changes
  useEffect(() => {
    setSelectedServices([]);
  }, [selectedHostId]);

  const fetchTutors = async () => {
    try {
      const res = await fetch('/api/tutors');
      const data = await res.json();
      setTutors(data);
      if (data.length > 0) {
        setSelectedTutorId(data[0].id.toString());
      }
    } catch (err) {
      showAlert('danger', 'Erro', 'Não foi possível carregar os tutores.');
    }
  };

  const fetchHosts = async () => {
    try {
      const res = await fetch('/api/hosts');
      const data = await res.json();
      setHosts(data);
    } catch (err) {
      showAlert('danger', 'Erro', 'Não foi possível carregar os anfitriões.');
    }
  };

  const fetchPets = async (tutorId) => {
    try {
      const res = await fetch(`/api/tutors/${tutorId}/pets`);
      const data = await res.json();
      setPets(data);
    } catch (err) {
      showAlert('danger', 'Erro', 'Não foi possível carregar os pets.');
    }
  };

  const fetchHistory = async (tutorId) => {
    try {
      const res = await fetch(`/api/tutors/${tutorId}/reservations`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      showAlert('danger', 'Erro', 'Não foi possível carregar o histórico de reservas.');
    }
  };

  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
    // Scroll to alert
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAlert = () => setAlert(null);

  const handleServiceChange = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Calculate price locally for display
  const calculateEstimatedPrice = () => {
    if (!selectedHostId || !startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end < start) return 0;

    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

    const selectedHost = hosts.find(h => h.id.toString() === selectedHostId);
    if (!selectedHost) return 0;

    const basePrice = 50.00 * days; // Assumption: R$ 50/day base
    let servicesPrice = 0;

    if (selectedHost.services) {
      selectedHost.services.forEach(s => {
        if (selectedServices.includes(s.id)) {
          servicesPrice += s.price;
        }
      });
    }

    return basePrice + servicesPrice;
  };

  const handleRequestReservation = async (e) => {
    e.preventDefault();
    clearAlert();

    // Check frontend validation
    if (!selectedTutorId || !selectedPetId || !selectedHostId || !startDate || !endDate) {
      showAlert('warning', 'Campos inválidos', 'Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutor_id: parseInt(selectedTutorId),
          pet_id: parseInt(selectedPetId),
          host_id: parseInt(selectedHostId),
          start_date: startDate,
          end_date: endDate,
          service_ids: selectedServices
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend failure or business validation error
        showAlert('danger', data.error || 'Algo deu errado', data.message);
      } else {
        // Success
        showAlert('success', 'Solicitação enviada!', 'Sua solicitação de reserva foi enviada ao anfitrião com sucesso!');
        // Reset form
        setSelectedHostId('');
        setStartDate('');
        setEndDate('');
        setSelectedServices([]);
        // Refresh history
        fetchHistory(selectedTutorId);
      }
    } catch (err) {
      showAlert('danger', 'Algo deu errado', 'Não conseguimos processar sua solicitação no momento. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    clearAlert();
    if (!confirm('Deseja realmente cancelar esta solicitação de reserva?')) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert('danger', data.error || 'Erro ao cancelar', data.message);
      } else {
        showAlert('success', 'Cancelada com sucesso!', data.message);
        // Refresh history
        fetchHistory(selectedTutorId);
      }
    } catch (err) {
      showAlert('danger', 'Erro', 'Não foi possível cancelar a reserva no momento.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedHost = hosts.find(h => h.id.toString() === selectedHostId);
  const selectedPet = pets.find(p => p.id.toString() === selectedPetId);

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>Hospetse 🐾</h1>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Protótipo Vertical Slice - Teste 4</p>
        </div>
        
        <div className="tutor-select-container">
          <label htmlFor="tutor-select" style={{ fontWeight: 600 }}>Tutor Ativo:</label>
          <select 
            id="tutor-select" 
            value={selectedTutorId} 
            onChange={(e) => setSelectedTutorId(e.target.value)}
          >
            <option value="">-- Selecione um Tutor --</option>
            {tutors.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
            ))}
          </select>
        </div>
      </header>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>
                {alert.title}
              </strong>
              <span>{alert.message}</span>
            </div>
            <button 
              onClick={clearAlert} 
              style={{ background: 'none', color: 'inherit', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid">
        {/* Left Column: Booking Form */}
        <div className="card">
          <h2>Solicitar Reserva (HPET04)</h2>
          <form onSubmit={handleRequestReservation}>
            
            {/* 1. Select Host */}
            <div className="form-group">
              <label style={{ fontWeight: 600 }}>1. Selecione o Anfitrião/Host *</label>
              <div className="host-grid" style={{ marginTop: '0.5rem' }}>
                {hosts.map(h => (
                  <div 
                    key={h.id} 
                    className={`host-card ${selectedHostId === h.id.toString() ? 'selected' : ''}`}
                    onClick={() => setSelectedHostId(h.id.toString())}
                  >
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{h.name}</h3>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      Base: R$ 50,00/dia
                    </p>
                    <div>
                      <span className="badge badge-species">Aceita: {h.accepted_species}</span>
                      <span className="badge badge-size">Portes: {h.accepted_sizes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Define Dates */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="start-date" style={{ fontWeight: 600 }}>Data de Entrada *</label>
                <input 
                  type="date" 
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="end-date" style={{ fontWeight: 600 }}>Data de Saída *</label>
                <input 
                  type="date" 
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 3. Select Pet */}
            <div className="form-group">
              <label htmlFor="pet-select" style={{ fontWeight: 600 }}>3. Selecione seu Pet *</label>
              <select 
                id="pet-select"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                style={{ marginTop: '0.5rem' }}
                required
              >
                <option value="">-- Escolha um Pet --</option>
                {pets.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} - Porte {p.size})
                  </option>
                ))}
              </select>
              {pets.length === 0 && selectedTutorId && (
                <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Aviso: O tutor precisa possuir ao menos um pet cadastrado.
                </p>
              )}
            </div>

            {/* 4. Select Services */}
            {selectedHost && selectedHost.services && selectedHost.services.length > 0 && (
              <div className="form-group">
                <label style={{ fontWeight: 600 }}>4. Serviços Adicionais (Opcional)</label>
                <div className="services-list">
                  {selectedHost.services.map(s => (
                    <div 
                      key={s.id} 
                      className="service-item"
                      onClick={() => handleServiceChange(s.id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes(s.id)}
                        onChange={() => {}} // Handled by container click
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>
                        + R$ {s.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Summary */}
            {selectedHostId && startDate && endDate && (
              <div className="price-summary">
                <h4 style={{ marginBottom: '0.5rem' }}>Resumo de Preços Estimado</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Hospedagem Base (R$ 50,00/dia):</span>
                  <span>
                    R$ {(calculateEstimatedPrice() - (selectedHost?.services?.filter(s => selectedServices.includes(s.id)).reduce((acc, curr) => acc + curr.price, 0) || 0)).toFixed(2)}
                  </span>
                </div>
                {selectedServices.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Serviços Adicionais:</span>
                    <span>
                      R$ {selectedHost?.services?.filter(s => selectedServices.includes(s.id)).reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span>Total Estimado:</span>
                  <span style={{ color: 'var(--success-color)', fontSize: '1.2rem' }}>
                    R$ {calculateEstimatedPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={isLoading || !selectedTutorId}
            >
              {isLoading ? 'Processando...' : 'Confirmar Solicitação de Reserva'}
            </button>
          </form>
        </div>

        {/* Right Column: History */}
        <div className="card">
          <h2>Histórico de Reservas (HPET08a / HPET04a)</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '-0.5rem' }}>
            Consulte o andamento ou cancele solicitações ativas.
          </p>

          <div className="history-list">
            {history.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem 0' }}>
                Nenhuma reserva localizada para este tutor.
              </p>
            ) : (
              history.map(r => (
                <div key={r.id} className="history-card">
                  <div className="history-header">
                    <strong style={{ fontSize: '1.1rem' }}>{r.host_name}</strong>
                    <span className={`status-badge status-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Pet:</strong> {r.pet_name} <br />
                    <strong>Período:</strong> {r.start_date} até {r.end_date} <br />
                    <strong>Preço Total:</strong> R$ {r.total_price.toFixed(2)}
                  </div>

                  {r.services && r.services.length > 0 && (
                    <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
                      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Serviços inclusos:</strong>
                      {r.services.map(s => (
                        <div key={s.id}>• {s.name} (+R$ {s.price.toFixed(2)})</div>
                      ))}
                    </div>
                  )}

                  {/* Cancel Button - Allowed only for Active (Pendente / Confirmada) */}
                  {(r.status === 'Pendente' || r.status === 'Confirmada') ? (
                    <button 
                      className="button-secondary button-danger" 
                      style={{ width: '100%', padding: '0.4rem', fontSize: '0.9rem' }}
                      onClick={() => handleCancelReservation(r.id)}
                      disabled={isLoading}
                    >
                      Cancelar Reserva
                    </button>
                  ) : r.status === 'Concluída' ? (
                    <button 
                      className="button-secondary" 
                      style={{ width: '100%', padding: '0.4rem', fontSize: '0.9rem' }}
                      disabled
                      title="Reservas concluídas não podem ser canceladas."
                    >
                      Concluída (Indisponível para Cancelar)
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                      Cancelamento já processado.
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
