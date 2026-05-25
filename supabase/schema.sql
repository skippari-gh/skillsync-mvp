create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  title text,
  location text,
  skills text,
  experience text,
  preferences text,
  portfolio_url text
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  company text not null,
  role text not null,
  location text,
  description text,
  requirements text,
  salary_range text
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  candidate_id uuid references candidates(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  score int,
  summary text,
  strengths jsonb,
  gaps jsonb,
  application_draft text,
  recruiter_favorite boolean default false
);
