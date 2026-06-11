import axios from 'axios';

// Tworzymy instancję celującą w nasz lokalny JSON Server
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Dodajemy Interceptor, który będzie logował każde wysłane zapytanie i dodawał token autoryzacyjny
api.interceptors.request.use((config) => {
  console.log('Wysłano zapytanie do:', config.url);
  
  // Symulacja dodania tokenu
  config.headers.Authorization = 'Bearer testowy-token-2137';
  return config;
});

export default api;
