import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSWR from 'swr';
import api from './api/client';
import { useState } from 'react';

// Funkcja fetchująca dla SWR
const swrFetcher = (url) => api.get(url).then(res => res.data);

function App() {
  const [newName, setNewName] = useState('');
  const queryClient = useQueryClient();

  // POBIERANIE SWR 
  const { data: swrUsers, isLoading: swrLoading } = useSWR('/users', swrFetcher);

  // POBIERANIE TanStack Query
  const { data: tsUsers, isLoading: tsLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
  });

  // MUTACJA: TanStack Query (Dodawanie danych + Inwalidacja)
  const addMutation = useMutation({
    mutationFn: (newUser) => api.post('/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewName('');
    },
  });

  const handleAddUser = () => {
    if (!newName) return;
    // co ciekawe, json-server sam wygeneruje ID
    addMutation.mutate({ name: newName });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Demo Pobierania Danych</h1>
      
      <div style={{ display: 'flex', gap: '50px' }}>
        {/* Sekcja SWR */}
        <div style={{ flex: 1, padding: '20px', border: '2px solid #fbbf24', borderRadius: '8px' }}>
          <h2>SWR (stale-while-revalidate)</h2>
          {swrLoading ? <p>Ładowanie SWR...</p> : (
            <ul>
              {swrUsers?.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
          )}
        </div>

        {/* Sekcja TanStack */}
        <div style={{ flex: 1, padding: '20px', border: '2px solid #ef4444', borderRadius: '8px' }}>
          <h2>TanStack Query</h2>
          {tsLoading ? <p>Ładowanie TanStack...</p> : (
            <ul>
              {tsUsers?.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <input 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="Imię nowego usera"
            />
            <button 
              onClick={handleAddUser} 
              disabled={addMutation.isPending}
              style={{ marginLeft: '10px' }}
            >
              {addMutation.isPending ? 'Dodawanie...' : 'Dodaj usera (Mutacja)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;