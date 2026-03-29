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

async function syncUsers() {
  console.log('🔄 Syncing Auth users to public.users...')

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error(`❌ Error listing users: ${listError.message}`)
    return
  }

  for (const user of users) {
    const role = user.user_metadata?.role || user.app_metadata?.role || 'staff'
    const full_name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

    console.log(`Checking user: ${user.email} (${role})...`)

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      console.log(`  ➕ Inserting into public.users...`)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          full_name,
          role: role as any
        })
      
      if (insertError) {
        console.error(`  ❌ Error syncing ${user.email}: ${insertError.message}`)
      } else {
        console.log(`  ✅ Synced ${user.email}`)
      }
    } else {
      console.log(`  ✨ Already synced.`)
    }
  }

  console.log('✅ Sync complete.')
}

syncUsers()
