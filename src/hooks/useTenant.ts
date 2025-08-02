export default function useTenant() {
  const location = window.location;
  const splittedUrl = location.hostname.split('.');

  if (
    (import.meta.env.DEV && splittedUrl.length < 2) ||
    (import.meta.env.PROD && splittedUrl.length < 3)
  ) {
    return null;
  }

  return splittedUrl[0];
}
