-- Fix AI Assistant Database Issues
-- Run this in Supabase to fix the schema mismatch

-- Update ai_conversations table to match code expectations
ALTER TABLE public.ai_conversations 
ADD COLUMN IF NOT EXISTS user_message TEXT,
ADD COLUMN IF NOT EXISTS bot_response TEXT,
ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'::jsonb;

-- Update existing data to new column names (if any exists)
UPDATE public.ai_conversations 
SET user_message = question, bot_response = response, context = metadata
WHERE user_message IS NULL;

-- Create missing ai_patterns table for learning
CREATE TABLE IF NOT EXISTS public.ai_patterns (
    id BIGSERIAL PRIMARY KEY,
    pattern_type TEXT NOT NULL,
    trigger TEXT NOT NULL UNIQUE,
    response TEXT NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.5,
    usage_count INTEGER DEFAULT 1,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for ai_patterns
CREATE INDEX IF NOT EXISTS idx_ai_patterns_trigger ON public.ai_patterns(trigger);
CREATE INDEX IF NOT EXISTS idx_ai_patterns_confidence ON public.ai_patterns(confidence);
CREATE INDEX IF NOT EXISTS idx_ai_patterns_type ON public.ai_patterns(pattern_type);

-- Enable RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their conversations" ON public.ai_conversations 
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create conversations" ON public.ai_conversations 
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create feedback" ON public.ai_feedback 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view feedback" ON public.ai_feedback 
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view patterns" ON public.ai_patterns 
    FOR SELECT USING (true);
CREATE POLICY "System can manage patterns" ON public.ai_patterns 
    FOR ALL USING (true);

-- Create function for pattern usage increment
CREATE OR REPLACE FUNCTION increment_pattern_usage(pattern_trigger TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.ai_patterns 
    SET usage_count = usage_count + 1, 
        last_used = NOW(),
        updated_at = NOW()
    WHERE trigger = pattern_trigger;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_feedback TO authenticated;
GRANT ALL ON public.ai_patterns TO authenticated;
GRANT EXECUTE ON FUNCTION increment_pattern_usage TO authenticated;