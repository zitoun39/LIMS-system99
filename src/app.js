import React, { useEffect, useState } from 'react';

function App() {
  const [samples, setSamples] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingSample, setEditingSample] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (token) {
      fetchSamples();
    }
  }, [token]);

  const fetchSamples = () => {
    fetch('/api/samples/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => setSamples([]));
  };

  const addSample = () => {
    if (!name) return alert('Name is required');
    fetch('/api/samples/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ name, description }),
    }).then(() => {
      fetchSamples();
      setName('');
      setDescription('');
    });
  };

  const deleteSample = (id) => {
    fetch(`/api/samples/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchSamples());
  };

  const startEditSample = (sample) => {
    setEditingSample(sample);
    setEditName(sample.name);
    setEditDescription(sample.description);
  };

  const submitEdit = () => {
    if (!editName) return alert('Name is required');
    fetch(`/api/samples/${editingSample.id}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editName, description: editDescription }),
    }).then(() => {
      fetchSamples();
      setEditingSample(null);
      setEditName('');
      setEditDescription('');
    });
  };

  const handleLogin = () => {
    if (!username || !password) return alert('Username and password required');
    fetch('/api-token-auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setError('');
      })
      .catch(() => {
        setError('Invalid username or password');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setSamples([]);
  };

  const handleImportCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/samples/import_csv/', {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    })
      .then(res => res.json())
      .then(() => {
        fetchSamples();
        alert('CSV imported successfully');
      })
      .catch(() => alert('Failed to import CSV'));
  };

  if (!token) {
    return (
      <div style={{ margin: 20 }}>
        <h2>Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button onClick={handleLogin}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ margin: 20 }}>
      <h1>Sample Manager</h1>
      <button onClick={handleLogout}>Logout</button>
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addSample}>Add Sample</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => window.open('/api/samples/export_csv/', '_blank')}>
          Export Samples CSV
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportCsv}
          style={{ marginLeft: 10 }}
        />
      </div>

      {editingSample && (
        <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
          <h3>Edit Sample</h3>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <button onClick={submitEdit}>Save</button>
          <button onClick={() => setEditingSample(null)}>Cancel</button>
        </div>
      )}

      <ul style={{ marginTop: 20 }}>
        {samples.map((s) => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            <b>{s.name}</b>: {s.description}{' '}
            <button onClick={() => startEditSample(s)}>Edit</button>{' '}
            <button onClick={() => deleteSample(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
