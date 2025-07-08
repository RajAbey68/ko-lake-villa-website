# Production Safety Protocol - Ko Lake Villa

## Critical Production Rules

### NEVER delete production data without:
1. Creating a verified backup first
2. User explicit approval 
3. Rollback plan in place
4. Testing the rollback procedure

## Emergency Backup & Restore System

### Available API Endpoints:

**Create Backup:**
```bash
curl -X POST http://localhost:5000/api/admin/gallery/backup \
  -H "Content-Type: application/json" \
  -d '{"reason": "Pre-maintenance backup", "performedBy": "admin"}'
```

**List Available Backups:**
```bash
curl http://localhost:5000/api/admin/gallery/backups
```

**Restore from Backup:**
```bash
curl -X POST http://localhost:5000/api/admin/gallery/restore/[BACKUP_ID] \
  -H "Content-Type: application/json" \
  -d '{"performedBy": "admin", "reason": "Emergency restore"}'
```

## If Images Were Accidentally Deleted:

1. **Immediate Action:** Stop all operations
2. **Check Backups:** GET /api/admin/gallery/backups
3. **Restore:** POST /api/admin/gallery/restore/[latest_backup_id]

## Going Forward:

- All mass operations must create backups first
- No direct database deletions without governance
- All changes must be reversible
- User approval required for any data removal

## Current Status:
- Backup system: ✅ Implemented
- Restore endpoints: ✅ Available  
- Audit logging: ✅ Active
- Rollback capability: ✅ Ready