/**
 * Force Gallery Cache Refresh
 * Invalidates frontend cache to show updated titles and descriptions
 */

// Run this in browser console to force refresh
console.log('🔄 Forcing gallery cache refresh...');

// Clear React Query cache for gallery data
if (window.__REACT_QUERY_STATE__) {
  // Clear the cache
  Object.keys(window.__REACT_QUERY_STATE__.queries || {}).forEach(key => {
    if (key.includes('/api/gallery')) {
      delete window.__REACT_QUERY_STATE__.queries[key];
    }
  });
}

// Force page reload to get fresh data
setTimeout(() => {
  console.log('✅ Cache cleared, reloading page...');
  window.location.reload();
}, 1000);