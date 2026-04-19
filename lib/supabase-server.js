import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerSideClient = () => createServerComponentClient({ cookies })
export const createAPIClient = () => createRouteHandlerClient({ cookies })
