import { createAPIClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  const { id: winnerId } = params
  const supabase = createAPIClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const { data: winner } = await supabase
      .from('winners')
      .select('user_id')
      .eq('id', winnerId)
      .single()

    if (!winner || winner.user_id !== user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${winnerId}-${Math.random()}.${fileExt}`
    const filePath = `proofs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('winner-proofs')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('winner-proofs')
      .getPublicUrl(filePath)

    await supabase
      .from('winners')
      .update({
        proof_url: publicUrl,
        verification_status: 'pending'
      })
      .eq('id', winnerId)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
