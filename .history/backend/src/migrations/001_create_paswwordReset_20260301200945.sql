<<<<<<< HEAD
CREATE TABLE password_resets (
=======
CREATE TABLE IF NOT EXISTS password_resets (
>>>>>>> feature/resetPassword
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
