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

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);