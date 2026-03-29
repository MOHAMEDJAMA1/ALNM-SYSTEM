import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function run() {
  const s = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Test the insert with only fields that exist
  const { error: testErr } = await s.from('cash_submissions').insert({
    staff_id: 'f9d62f46-b344-415f-9d8d-8cc26ac49c80',
    submission_date: '2026-03-28',
    tanks_sold: 0,
    money_collected: 5,
    submitted_amount: 5,
    amount: 5,
    difference_amount: 0,
    note: 'migration-test',
    status: 'pending'
  })

  if (testErr) {
    console.log('❌ Schema missing columns:', testErr.message)
    console.log('\n📋 PLEASE RUN THIS SQL IN SUPABASE SQL EDITOR:')
    console.log(`
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS submission_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS tanks_sold INTEGER DEFAULT 0;
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS money_collected DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS submitted_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS difference_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.cash_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
    `)
  } else {
    console.log('✅ Schema OK! Cleaning up test record...')
    await s.from('cash_submissions').delete().eq('note', 'migration-test')
    console.log('✅ Done! Submission should now work.')
  }
}

run().catch(console.error)
