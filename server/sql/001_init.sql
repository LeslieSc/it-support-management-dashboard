CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    branch VARCHAR(100) NOT NULL,

    category VARCHAR(30) NOT NULL
        CHECK (
            category IN (
                'Network',
                'Hardware',
                'Software',
                'POS',
                'Access',
                'Other'
            )
        ),

    priority VARCHAR(20) NOT NULL
        CHECK (
            priority IN (
                'Low',
                'Medium',
                'High',
                'Critical'
            )
        ),

    status VARCHAR(30) NOT NULL DEFAULT 'Open'
        CHECK (
            status IN (
                'Open',
                'In Progress',
                'Resolved',
                'Closed'
            )
        ),

    assigned_to VARCHAR(100),

    is_overdue BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS ticket_history (
    id SERIAL PRIMARY KEY,

    ticket_id INTEGER NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    field_name VARCHAR(50) NOT NULL,

    old_value TEXT,

    new_value TEXT,

    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket_id
ON ticket_history(ticket_id);