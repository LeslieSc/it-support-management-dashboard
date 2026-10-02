ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER;

ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS assigned_to_user_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tickets_created_by_user_fk'
    ) THEN
        ALTER TABLE tickets
        ADD CONSTRAINT tickets_created_by_user_fk
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tickets_assigned_to_user_fk'
    ) THEN
        ALTER TABLE tickets
        ADD CONSTRAINT tickets_assigned_to_user_fk
        FOREIGN KEY (assigned_to_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Existing demo tickets did not store a creator.
-- Assign them to the demo ADMIN account.
UPDATE tickets
SET created_by_user_id = (
    SELECT id
    FROM users
    WHERE email = 'leslie@example.com'
)
WHERE created_by_user_id IS NULL;

-- Migrate existing text technician assignments when a matching user exists.
UPDATE tickets AS t
SET assigned_to_user_id = u.id
FROM users AS u
WHERE t.assigned_to IS NOT NULL
  AND t.assigned_to = u.full_name
  AND t.assigned_to_user_id IS NULL;