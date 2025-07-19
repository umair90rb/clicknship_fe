import { Link } from '@tanstack/react-router';

export default function NotFound() {
  return (
    <div>
      <p>Page you are looking not found!</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
