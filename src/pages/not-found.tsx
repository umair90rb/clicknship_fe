export default function NotFound({ tenant = false }) {
  return (
    <p>
      {tenant
        ? 'Either page you are looking not found or you enter wrong url without you company id, correct url should look like company.example.com'
        : 'Page you are looking for is not found!'}
    </p>
  );
}
