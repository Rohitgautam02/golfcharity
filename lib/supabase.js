import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

let supabaseClient

export const createClientSideClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient()
  }
  return supabaseClient
}
