import { useParams } from 'react-router';

export default function UpdateOrder() {
  const { orderId } = useParams();
  return <div>Update Order {orderId}</div>;
}
