CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    full_name VARCHAR(120) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE'
        CHECK (
            role IN (
                'ADMIN',
                'TECHNICIAN',
                'EMPLOYEE'
            )
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);