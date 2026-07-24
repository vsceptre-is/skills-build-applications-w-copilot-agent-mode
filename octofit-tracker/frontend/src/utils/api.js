export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    const codespaceMatch = hostname.match(/^([a-z0-9-]+)-5173\.app\.github\.dev$/i);

    if (codespaceMatch) {
      return `https://${codespaceMatch[1]}-8000.app.github.dev`;
    }
  }

  return 'http://localhost:8000';
}

export function normalizeResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}
