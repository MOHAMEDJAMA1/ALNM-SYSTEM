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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedProductionData() {
  console.log('🌱 Seeding production items...')

  const { data: existingItems } = await supabase.from('items').select('id').limit(1)
  
  if (existingItems && existingItems.length > 0) {
    console.log('✨ Items already exist. Skipping seed.')
  } else {
    console.log('➕ Creating Standard Water Tank...')
    const { error } = await supabase.from('items').insert({
      name: 'Standard Water Tank',
      current_price: 3.50
    })
    
    if (error) {
      console.error(`❌ Error seeding items: ${error.message}`)
    } else {
      console.log('✅ Seeded Standard Water Tank.')
    }
  }

  // Also check for staff
  const { data: staffCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'staff')

  console.log(`👤 Current Staff Count: ${staffCount || 0}`)
  if ((staffCount as any) === 0) {
    console.log('⚠️ WARNING: No staff members found. Agent won\'t be able to distribute until a Staff account is created.')
  }

  console.log('✅ Seeding check complete.')
}

seedProductionData()
