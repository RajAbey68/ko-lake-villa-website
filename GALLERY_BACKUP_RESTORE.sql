-- Gallery Backup and Restore System
-- Created after production data deletion incident

-- Create backup table for gallery images
CREATE TABLE IF NOT EXISTS gallery_images_backup (
    backup_id SERIAL PRIMARY KEY,
    backup_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    backup_reason TEXT,
    original_id INTEGER,
    image_url TEXT,
    alt TEXT,
    title TEXT,
    description TEXT,
    category TEXT,
    tags TEXT[],
    featured BOOLEAN,
    sort_order INTEGER,
    media_type TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create audit log for gallery operations
CREATE TABLE IF NOT EXISTS gallery_audit_log (
    audit_id SERIAL PRIMARY KEY,
    operation TEXT, -- 'DELETE', 'UPDATE', 'INSERT'
    affected_ids INTEGER[],
    reason TEXT,
    performed_by TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    can_rollback BOOLEAN DEFAULT true
);

-- Function to backup before mass operations
CREATE OR REPLACE FUNCTION backup_gallery_images(reason TEXT)
RETURNS INTEGER AS $$
DECLARE
    backup_count INTEGER;
BEGIN
    INSERT INTO gallery_images_backup (
        backup_reason, original_id, image_url, alt, title, description, 
        category, tags, featured, sort_order, media_type, created_at, updated_at
    )
    SELECT 
        reason, id, image_url, alt, title, description,
        category, tags, featured, sort_order, media_type, created_at, updated_at
    FROM gallery_images;
    
    GET DIAGNOSTICS backup_count = ROW_COUNT;
    RETURN backup_count;
END;
$$ LANGUAGE plpgsql;

-- Function to restore from backup
CREATE OR REPLACE FUNCTION restore_gallery_from_backup(backup_timestamp TIMESTAMP)
RETURNS INTEGER AS $$
DECLARE
    restore_count INTEGER;
BEGIN
    -- Clear current gallery
    DELETE FROM gallery_images;
    
    -- Restore from backup
    INSERT INTO gallery_images (
        image_url, alt, title, description, category, tags, 
        featured, sort_order, media_type
    )
    SELECT 
        image_url, alt, title, description, category, tags,
        featured, sort_order, media_type
    FROM gallery_images_backup 
    WHERE backup_timestamp = backup_timestamp;
    
    GET DIAGNOSTICS restore_count = ROW_COUNT;
    RETURN restore_count;
END;
$$ LANGUAGE plpgsql;