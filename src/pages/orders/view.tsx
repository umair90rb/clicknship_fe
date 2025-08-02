import { useParams } from 'react-router';

export default function ViewOrder() {
  const { orderId } = useParams();
  return <div>Order {orderId}</div>;
}
