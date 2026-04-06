import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fzlfedubjblnhrivxvlw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bGZlZHViamJsbmhyaXZ4dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTM1NjcsImV4cCI6MjA5MDQyOTU2N30.mkVYLBCW2Y56OsBKOFiQGKaz_27JXCzS9Wx-JZ9YPKQ'

export const supabase = createClient(supabaseUrl, supabaseKey)