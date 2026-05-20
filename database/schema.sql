CREATE TYPE lead_status AS ENUM (
    'New Lead', 
    'Contacted', 
    'Site Visit Scheduled', 
    'Proposal Sent', 
    'Won', 
    'Lost'
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    system_size NUMERIC(5, 2) NOT NULL,
    source VARCHAR(100) NOT NULL,
    status lead_status DEFAULT 'New Lead',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_location ON leads(location);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_leads_timestamp
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


INSERT INTO leads (full_name, phone, email, location, property_type, system_size, source, status) VALUES
('Rajesh Kumar', '9876543210', 'rajesh@example.com', 'Kochi', 'Residential', 5.0, 'Website', 'New Lead'),
('Priya Menon', '8765432109', 'priya@example.com', 'Thrissur', 'Commercial', 20.0, 'Referral', 'Site Visit Scheduled'),
('Arun K', '1579523684', 'arun@example.com', 'Kozhikode', 'Industrial', 45.5, 'Social Media', 'Proposal Sent'),
('Sandhya Nair', '6984125388', 'sandhya@example.com', 'Kochi', 'Residential', 8.0, 'Walk-in', 'Won'),
('Thomas', '1245789630', 'thomas@example.com', 'Palakkad', 'Commercial', 12.0, 'Website', 'Lost');