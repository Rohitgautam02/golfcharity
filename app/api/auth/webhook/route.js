import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use service role key to bypass RLS since this is a secure webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const secret = req.headers.get('x-supabase-webhook-secret')
  
  // Optional: verify webhook secret if configured in Supabase
  // if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
  //   return new NextResponse('Unauthorized', { status: 401 })
  // }

  try {
    const body = await req.json()
    const { record, type } = body

    // Supabase can call this for different events
    // This hook is redundant if the SQL handle_new_user() trigger works,
    // but it's good as a backup or for complex logic.
    
    if (type === 'INSERT' && record.id) {
       // logic here if needed
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
