import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { logout } = useAuth();
  return (
    <div>
      Dashboard
      <button onClick={logout}>logout</button>
    </div>
  );
}
