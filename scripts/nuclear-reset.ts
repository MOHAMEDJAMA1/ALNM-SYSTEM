import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function nuclearReset() {
  console.log('🚀 Starting NUCLEAR RESET...')

  // 1. Delete data from public tables in correct order
  const tables = [
    'audit_logs',
    'payments',
    'sale_items',
    'sales',
    'cash_submissions',
    'distributions',
    'customers',
    'items',
    'users' // public.users - will be deleted by auth.users cascade anyway, but good to be explicit
  ]

  for (const table of tables) {
    console.log(`🗑️ Clearing table: ${table}...`)
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    if (error) {
      console.warn(`⚠️ Warning clearing ${table}: ${error.message}`)
    }
  }

  // 2. Delete all users from auth.users
  console.log('👤 Deleting all users from auth...')
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error(`❌ Error listing users: ${listError.message}`)
  } else if (users) {
    console.log(`Found ${users.length} users to delete.`)
    for (const user of users) {
      console.log(`  - Deleting user: ${user.email} (${user.id})...`)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (deleteError) {
        console.error(`  ❌ Error deleting ${user.email}: ${deleteError.message}`)
      }
    }
  }

  console.log('✅ NUCLEAR RESET COMPLETE. The system is now a clean slate.')
}

nuclearReset()
