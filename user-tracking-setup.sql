-- User Activity Tracking Tables Setup
-- Run this in your Supabase SQL editor to enable user activity tracking

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    duration INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    pages_visited TEXT[],
    user_agent TEXT,
    referrer TEXT,
    ip_address INET,
    country TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    path TEXT NOT NULL,
    title TEXT,
    referrer TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_events table
CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    event_data JSONB,
    path TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON public.user_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON public.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON public.page_views(timestamp);

CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON public.user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_name ON public.user_events(event_name);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON public.user_events(timestamp);

-- Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Anyone can insert sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all sessions" ON public.user_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Create policies for page_views
CREATE POLICY "Anyone can insert page views" ON public.page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own page views" ON public.page_views
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all page views" ON public.page_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Create policies for user_events
CREATE POLICY "Anyone can insert events" ON public.user_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own events" ON public.user_events
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all events" ON public.user_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON public.user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get popular pages
CREATE OR REPLACE FUNCTION get_popular_pages(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    path TEXT,
    title TEXT,
    view_count BIGINT,
    unique_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.path,
        pv.title,
        COUNT(*) as view_count,
        COUNT(DISTINCT pv.session_id) as unique_sessions
    FROM public.page_views pv
    WHERE pv.timestamp >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY pv.path, pv.title
    ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user activity summary
CREATE OR REPLACE FUNCTION get_activity_summary(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    total_sessions BIGINT,
    total_page_views BIGINT,
    unique_visitors BIGINT,
    avg_session_duration NUMERIC,
    top_referrer TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT us.session_id) as total_sessions,
        COUNT(pv.id) as total_page_views,
        COUNT(DISTINCT us.user_id) as unique_visitors,
        AVG(us.duration / 1000.0) as avg_session_duration,
        (
            SELECT us2.referrer 
            FROM public.user_sessions us2 
            WHERE us2.referrer IS NOT NULL 
              AND us2.created_at >= NOW() - INTERVAL '1 day' * days_back
            GROUP BY us2.referrer 
            ORDER BY COUNT(*) DESC 
            LIMIT 1
        ) as top_referrer
    FROM public.user_sessions us
    LEFT JOIN public.page_views pv ON us.session_id = pv.session_id
    WHERE us.created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update site_stats table with tracking data
INSERT INTO public.site_stats (
    farmers_trained, 
    certificates_issued, 
    yield_improvement, 
    sustainable_projects
)
SELECT 1250, 890, 35, 180
WHERE NOT EXISTS (SELECT 1 FROM public.site_stats)
ON CONFLICT DO NOTHING;