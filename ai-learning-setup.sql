-- AI Learning System Database Setup

-- Table to store all conversations for learning
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store learned patterns
CREATE TABLE IF NOT EXISTS ai_patterns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pattern_type VARCHAR(50) NOT NULL,
    trigger TEXT NOT NULL UNIQUE,
    response TEXT NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.5,
    usage_count INTEGER DEFAULT 1,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track learning performance
CREATE TABLE IF NOT EXISTS ai_learning_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    context JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_patterns_trigger ON ai_patterns(trigger);
CREATE INDEX IF NOT EXISTS idx_ai_patterns_confidence ON ai_patterns(confidence);
CREATE INDEX IF NOT EXISTS idx_ai_patterns_pattern_type ON ai_patterns(pattern_type);

-- Function to increment pattern usage
CREATE OR REPLACE FUNCTION increment_pattern_usage(pattern_trigger TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE ai_patterns 
    SET usage_count = usage_count + 1,
        last_used = NOW(),
        updated_at = NOW()
    WHERE trigger = pattern_trigger;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old conversations (keep last 10000)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS VOID AS $$
BEGIN
    DELETE FROM ai_conversations 
    WHERE id NOT IN (
        SELECT id FROM ai_conversations 
        ORDER BY created_at DESC 
        LIMIT 10000
    );
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_metrics ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own conversations
CREATE POLICY "Users can insert own conversations" ON ai_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own conversations
CREATE POLICY "Users can read own conversations" ON ai_conversations
    FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to manage patterns
CREATE POLICY "Service role can manage patterns" ON ai_patterns
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read patterns
CREATE POLICY "Authenticated users can read patterns" ON ai_patterns
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to manage metrics
CREATE POLICY "Service role can manage metrics" ON ai_learning_metrics
    FOR ALL USING (auth.role() = 'service_role');