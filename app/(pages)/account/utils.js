// Helper function to update URL with tab parameter
export function updateTabInUrl(tab) {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tab);
  window.history.pushState({}, '', url);
}
