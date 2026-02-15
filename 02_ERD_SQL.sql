-- 채용 제안 플랫폼 PostgreSQL 스키마 초안 v1

-- ENUMS
CREATE TYPE user_role AS ENUM ('JOB_SEEKER', 'COMPANY_USER', 'ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE proposal_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CHATTING', 'FINAL_HIRED');
CREATE TYPE chat_room_status AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE hire_status AS ENUM ('FINALIZED', 'CANCELED');
CREATE TYPE settlement_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- USERS
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  role user_role NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30) UNIQUE,
  password_hash VARCHAR(255),
  refresh_token_hash VARCHAR(255),
  status user_status NOT NULL DEFAULT 'ACTIVE',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- JOB SEEKER PROFILE
CREATE TABLE job_seeker_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
  full_name_enc BYTEA, -- AES 암호화 저장 권장
  contact_email_enc BYTEA,
  contact_phone_enc BYTEA,
  desired_salary_min INT NOT NULL,
  desired_salary_max INT NOT NULL,
  desired_locations TEXT[] NOT NULL DEFAULT '{}',
  job_category VARCHAR(100) NOT NULL,
  years_experience SMALLINT NOT NULL CHECK (years_experience BETWEEN 0 AND 40),
  skills TEXT[] NOT NULL DEFAULT '{}',
  career_summary TEXT,
  intro_text TEXT,
  available_from DATE,
  is_profile_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (desired_salary_min <= desired_salary_max)
);

-- COMPANY PROFILE
CREATE TABLE company_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
  company_name VARCHAR(200) NOT NULL,
  business_registration_no VARCHAR(50) NOT NULL UNIQUE,
  domain VARCHAR(200),
  contact_email VARCHAR(255),
  company_size VARCHAR(50),
  industry VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COMPANY VERIFICATION
CREATE TABLE company_verifications (
  id BIGSERIAL PRIMARY KEY,
  company_profile_id BIGINT NOT NULL REFERENCES company_profiles(id),
  status verification_status NOT NULL DEFAULT 'PENDING',
  submitted_doc_url TEXT,
  reviewer_admin_id BIGINT REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  reject_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROPOSALS
CREATE TABLE proposals (
  id BIGSERIAL PRIMARY KEY,
  company_profile_id BIGINT NOT NULL REFERENCES company_profiles(id),
  job_seeker_profile_id BIGINT NOT NULL REFERENCES job_seeker_profiles(id),
  position_title VARCHAR(200) NOT NULL,
  offer_salary_min INT NOT NULL,
  offer_salary_max INT NOT NULL,
  work_type VARCHAR(30), -- onsite/hybrid/remote
  message TEXT NOT NULL,
  status proposal_status NOT NULL DEFAULT 'PENDING',
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  finalized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (offer_salary_min <= offer_salary_max)
);

-- PROPOSAL STATUS LOG
CREATE TABLE proposal_status_logs (
  id BIGSERIAL PRIMARY KEY,
  proposal_id BIGINT NOT NULL REFERENCES proposals(id),
  from_status proposal_status,
  to_status proposal_status NOT NULL,
  actor_user_id BIGINT NOT NULL REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CHAT ROOMS
CREATE TABLE chat_rooms (
  id BIGSERIAL PRIMARY KEY,
  proposal_id BIGINT NOT NULL UNIQUE REFERENCES proposals(id),
  company_user_id BIGINT NOT NULL REFERENCES users(id),
  job_seeker_user_id BIGINT NOT NULL REFERENCES users(id),
  status chat_room_status NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- CHAT MESSAGES
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT NOT NULL REFERENCES chat_rooms(id),
  sender_user_id BIGINT NOT NULL REFERENCES users(id),
  message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
  content TEXT NOT NULL,
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HIRES
CREATE TABLE hires (
  id BIGSERIAL PRIMARY KEY,
  proposal_id BIGINT NOT NULL UNIQUE REFERENCES proposals(id),
  company_profile_id BIGINT NOT NULL REFERENCES company_profiles(id),
  job_seeker_profile_id BIGINT NOT NULL REFERENCES job_seeker_profiles(id),
  status hire_status NOT NULL DEFAULT 'FINALIZED',
  finalized_by_user_id BIGINT NOT NULL REFERENCES users(id),
  finalized_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SETTLEMENTS
CREATE TABLE settlements (
  id BIGSERIAL PRIMARY KEY,
  hire_id BIGINT NOT NULL REFERENCES hires(id),
  company_profile_id BIGINT NOT NULL REFERENCES company_profiles(id),
  amount INT NOT NULL CHECK (amount >= 0),
  fee_type VARCHAR(30) NOT NULL, -- success_fee/subscription
  status settlement_status NOT NULL DEFAULT 'PENDING',
  billed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ADMIN ACTION LOG
CREATE TABLE admin_actions (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id BIGINT NOT NULL REFERENCES users(id),
  action_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id BIGINT NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AUDIT LOG (개인정보 열람/공개 이력)
CREATE TABLE pii_access_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT NOT NULL REFERENCES users(id),
  target_user_id BIGINT NOT NULL REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL, -- VIEW_CONTACT, UNMASK_PROFILE
  proposal_id BIGINT REFERENCES proposals(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_job_seeker_search_1 ON job_seeker_profiles (job_category, years_experience);
CREATE INDEX idx_proposals_company_status ON proposals (company_profile_id, status, created_at DESC);
CREATE INDEX idx_proposals_seeker_status ON proposals (job_seeker_profile_id, status, created_at DESC);
CREATE INDEX idx_chat_messages_room_created ON chat_messages (room_id, created_at DESC);
CREATE INDEX idx_settlements_company_status ON settlements (company_profile_id, status, created_at DESC);
CREATE INDEX idx_pii_access_target_created ON pii_access_logs (target_user_id, created_at DESC);
