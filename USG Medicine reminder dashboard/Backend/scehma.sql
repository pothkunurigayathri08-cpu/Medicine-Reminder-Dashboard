-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    time VARCHAR(50) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Create policy allowing public access for educational/beginner purposes 
-- (Note: In production, you should restrict this to authenticated users)
CREATE POLICY "Allow public access to medicines" 
    ON medicines 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);