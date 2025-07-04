import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pynedpawqtllihyfejry.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bmVkcGF3cXRsbGloeWZlanJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Mjk0NDYsImV4cCI6MjA2NjMwNTQ0Nn0.qyKZLItZSCgf7XHBsa22icX0frRUvAlosClJZBbZgN0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage
  }
})
