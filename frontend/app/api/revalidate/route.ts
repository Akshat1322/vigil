import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  
  // Basic protection — only allow if secret matches
  // Set REVALIDATE_SECRET in your .env
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' }, 
      { status: 401 }
    )
  }

  // Revalidate all dashboard-related paths
  revalidatePath('/dashboard')
  revalidatePath('/models/[id]', 'page')
  revalidatePath('/reports/[id]', 'page')
  
  return NextResponse.json({ 
    revalidated: true, 
    timestamp: new Date().toISOString() 
  })
}
