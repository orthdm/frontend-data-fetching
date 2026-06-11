import useSWR from 'swr';
import api from '../api/client';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function SWRUsers() {
  // SWR: Ścieżka jako klucz cache
  const { data, error, isLoading } = useSWR('/users', fetcher);

  if (isLoading) return <p>Ładowanie...</p>;
  if (error) return <p>Wystąpił błąd!</p>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}