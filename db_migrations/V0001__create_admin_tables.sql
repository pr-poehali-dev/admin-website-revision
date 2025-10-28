-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create users table for regular users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create withdrawals table for withdrawal requests
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    method VARCHAR(50) NOT NULL,
    payment_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by INTEGER REFERENCES admin_users(id),
    notes TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2b$10$rN5z.KxYh8Y0tF0OJ5vKvuKjJ.xXF8QJ8G0zF8QJ8G0zF8QJ8G0zF', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- Insert sample users for testing
INSERT INTO users (name, email, phone, balance) VALUES
    ('Иван Петров', 'ivan@example.com', '+7 (900) 123-45-67', 15000.00),
    ('Мария Сидорова', 'maria@example.com', '+7 (900) 234-56-78', 28000.00),
    ('Алексей Иванов', 'alex@example.com', '+7 (900) 345-67-89', 8500.00),
    ('Елена Смирнова', 'elena@example.com', '+7 (900) 456-78-90', 42000.00),
    ('Дмитрий Козлов', 'dmitry@example.com', '+7 (900) 567-89-01', 19500.00)
ON CONFLICT (email) DO NOTHING;

-- Insert sample withdrawals
INSERT INTO withdrawals (user_id, amount, status, method, payment_details) VALUES
    (1, 5000.00, 'pending', 'Карта', '1234 **** **** 5678'),
    (2, 12000.00, 'pending', 'QIWI', '+79001234567'),
    (3, 3500.00, 'approved', 'ЮMoney', '410011234567890'),
    (4, 8000.00, 'pending', 'Карта', '9876 **** **** 4321'),
    (5, 6500.00, 'approved', 'СБП', '+79009876543')
ON CONFLICT DO NOTHING;