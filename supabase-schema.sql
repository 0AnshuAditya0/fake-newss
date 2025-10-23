-- Create the analyses table for storing user analysis data
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_text TEXT NOT NULL,
  prediction TEXT NOT NULL CHECK (prediction IN ('FAKE', 'REAL', 'UNCERTAIN')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  flags TEXT[] DEFAULT '{}',
  signals JSONB NOT NULL DEFAULT '{
    "ml_score": 50,
    "sentiment_score": 50,
    "clickbait_score": 50,
    "source_score": 50,
    "bias_score": 50
  }',
  source_domain TEXT,
  source_credibility TEXT CHECK (source_credibility IN ('high', 'medium', 'low')),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_prediction_idx ON analyses(prediction);

-- Enable Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own analyses
CREATE POLICY "Users can only access their own analyses" ON analyses
  FOR ALL USING (auth.uid() = user_id);

-- Allow anonymous users (for this demo - in production you'd want proper auth)
CREATE POLICY "Allow anonymous access for demo" ON analyses
  FOR ALL USING (true);
