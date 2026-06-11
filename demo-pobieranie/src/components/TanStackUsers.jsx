import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export default function TanStackUsers() {
  // TanStack Query: Unikalny queryKey + Axios
  const { data, status } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
  });

  if (status === 'pending') return <p>Ładowanie...</p>;
  if (status === 'error') return <p>Wystąpił błąd!</p>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

