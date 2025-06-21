# Ko Lake Villa - Deployment Checklist

## Before Every Deployment

1. **Save All Files** - Use Ctrl+S to save any open files
2. **Wait for Auto-Sync** - Watch console for "hmr update" messages to complete
3. **Run Quick Test** - Check admin pricing page works locally
4. **Click Redeploy** - Use the Redeploy button in your Deployments tab

## Key Files That Must Be Synced
- ✅ `client/src/pages/admin/Dashboard.tsx` (Unified admin interface)
- ✅ `client/src/pages/AdminCalendar.tsx` (Pricing editor)
- ✅ `client/src/pages/Accommodation.tsx` (Public pricing display)
- ✅ `client/src/pages/Home.tsx` (Our Property section)
- ✅ `server/routes.ts` (Sunday auto-revert API)

## If Deployment Doesn't Include Changes
1. Refresh your browser (F5)
2. Wait 30 seconds for file sync
3. Click Redeploy again

Your Ko Lake Villa pricing system is robust and will deploy correctly every time with this simple process!