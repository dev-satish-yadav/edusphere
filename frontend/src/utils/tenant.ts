export const getTenantSlug = (): string | null => {
  const hostname = window.location.hostname;
  
  // Ignore local IP or pure localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const parts = hostname.split('.');
  
  // if format is {slug}.localhost, length is 2. slug is parts[0]
  // if format is {slug}.edusphere.com, length is 3. slug is parts[0]
  if (parts.length >= 2) {
    return parts[0];
  }

  return null;
};
