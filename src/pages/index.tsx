import useAuth from '../hooks/useAuth';

export default function Index() {
  const { logout } = useAuth();
  return (
    <div>
      Dashboard
      <button onClick={logout}>logout</button>
    </div>
  );
}
