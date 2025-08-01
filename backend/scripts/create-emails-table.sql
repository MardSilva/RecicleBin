-- Criar tabela para armazenar emails subscritos
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribe_token VARCHAR(255) UNIQUE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_token ON email_subscriptions(unsubscribe_token);
