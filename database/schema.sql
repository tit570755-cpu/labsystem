-- LabSystem Database Schema (PostgreSQL)

-- ENUMS
CREATE TYPE user_role AS ENUM ('recepcao', 'biomedico', 'administrador');
CREATE TYPE exam_status AS ENUM ('pendente', 'em_analise', 'liberado', 'cancelado');
CREATE TYPE gender_enum AS ENUM ('M', 'F', 'Outro');

-- 1. Usuários do Sistema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    crbm VARCHAR(20), -- Apenas para biomédicos
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pacientes
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    cpf_encrypted VARCHAR(255) UNIQUE NOT NULL, -- LGPD: Criptografado
    birth_date DATE NOT NULL,
    gender gender_enum NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Consentimento LGPD
CREATE TABLE lgpd_consents (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    consent_version VARCHAR(10) NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    revocation_date TIMESTAMP
);

-- 4. Profissionais Solicitantes (Médicos)
CREATE TABLE requesting_professionals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    uf VARCHAR(2) NOT NULL,
    specialty VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100)
);

-- 5. Convênios
CREATE TABLE health_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ans_code VARCHAR(50),
    active BOOLEAN DEFAULT TRUE
);

-- 6. Categorias de Exames (Ex: Bioquímica, Hematologia)
CREATE TABLE exam_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 7. Materiais Biológicos
CREATE TABLE biological_materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    tube_color VARCHAR(30) -- Ex: Tampa Vermelha, Roxa
);

-- 8. Catálogo de Exames
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES exam_categories(id),
    code VARCHAR(20) UNIQUE NOT NULL, -- Código TUSS/CBHPM
    name VARCHAR(100) NOT NULL,
    material_id INTEGER REFERENCES biological_materials(id),
    methodology VARCHAR(100),
    turnaround_time_days INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    base_price DECIMAL(10, 2) NOT NULL
);

-- 9. Valores de Referência
CREATE TABLE reference_values (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id),
    gender gender_enum, -- NULL = ambos
    min_age_years INTEGER,
    max_age_years INTEGER,
    min_value DECIMAL(10, 3),
    max_value DECIMAL(10, 3),
    text_value VARCHAR(255), -- Para resultados qualitativos (ex: 'Não Reagente')
    unit VARCHAR(20)
);

-- 10. Requisições de Exames (Ordem de Serviço)
CREATE TABLE exam_requests (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    professional_id INTEGER REFERENCES requesting_professionals(id),
    health_plan_id INTEGER REFERENCES health_plans(id),
    user_id INTEGER REFERENCES users(id), -- Quem cadastrou
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2)
);

-- 11. Itens da Requisição
CREATE TABLE exam_request_items (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES exam_requests(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id),
    status exam_status DEFAULT 'pendente',
    collection_date TIMESTAMP,
    collected_by INTEGER REFERENCES users(id),
    price DECIMAL(10, 2) NOT NULL
);

-- 12. Resultados
CREATE TABLE exam_results (
    id SERIAL PRIMARY KEY,
    request_item_id INTEGER REFERENCES exam_request_items(id) UNIQUE,
    numeric_value DECIMAL(10, 3),
    text_value TEXT,
    analyzed_by INTEGER REFERENCES users(id), -- Biomédico
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 13. Laudos
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    request_item_id INTEGER REFERENCES exam_request_items(id) UNIQUE,
    released_by INTEGER REFERENCES users(id), -- Biomédico responsável
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    digital_signature TEXT NOT NULL,
    pdf_path VARCHAR(255)
);

-- 14. Logs de Auditoria (LGPD/Segurança)
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- 15. Financeiro
CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES exam_requests(id),
    health_plan_id INTEGER REFERENCES health_plans(id),
    amount DECIMAL(10, 2) NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'pendente'
);
