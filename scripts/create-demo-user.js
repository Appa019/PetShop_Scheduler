import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const { data, error } = await supabase.auth.admin.createUser({
  email: 'demo@8patas.com',
  password: 'demo123',
  email_confirm: true,
  user_metadata: { name: 'Demo' }
})

if (error) {
  console.error('Error creating demo user:', error.message)
  process.exit(1)
}

console.log('Demo user created successfully:', data.user.email)
