import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function wipeOperationalData() {
  console.log('Initiating Pre-Deployment Data Purge...')
  const dummyId = '00000000-0000-0000-0000-000000000000'

  const tablesToWipe = [
    'payments',
    'sale_items',
    'cash_submissions',
    'sales',
    'distributions',
    'customers',
    'audit_logs'
  ]

  for (const table of tablesToWipe) {
    console.log(`Wiping all records from table: ${table}...`)
    const { error } = await supabase.from(table).delete().neq('id', dummyId)
    if (error) {
      console.error(`Failed to wipe ${table}:`, error.message)
    } else {
      console.log(`SUCCESS: Wiped ${table}.`)
    }
  }

  console.log('Data Purge Complete! The system is now a clean slate for production.')
  console.log('NOTE: Users (Accontants, Staff, Agents) and static Items were preserved.')
}

wipeOperationalData()
