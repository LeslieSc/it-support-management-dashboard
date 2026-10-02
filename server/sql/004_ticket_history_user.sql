ALTER TABLE ticket_history
ADD COLUMN IF NOT EXISTS changed_by_user_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ticket_history_changed_by_user_fk'
    ) THEN
        ALTER TABLE ticket_history
        ADD CONSTRAINT ticket_history_changed_by_user_fk
        FOREIGN KEY (changed_by_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ticket_history_changed_by_user_id
ON ticket_history(changed_by_user_id);