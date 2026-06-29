const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Cache for 60 seconds — short enough to show 
// fresh data soon after a harness run, long enough 
// to not hammer the API on every page visit
const REVALIDATE_SECONDS = 60

export async function fetchModels() {
  const res = await fetch(`${API_BASE}/api/models`, {
    next: { revalidate: REVALIDATE_SECONDS }
  })
  if (!res.ok) throw new Error('Failed to fetch models')
  return res.json()
}

export async function fetchModel(modelName: string) {
  const encoded = encodeURIComponent(modelName)
  const res = await fetch(
    `${API_BASE}/api/models/${encoded}`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (!res.ok) throw new Error('Failed to fetch model')
  return res.json()
}

export async function fetchModelHistory(modelName: string) {
  const encoded = encodeURIComponent(modelName)
  const res = await fetch(
    `${API_BASE}/api/models/${encoded}/history`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (!res.ok) return []
  return res.json()
}

export async function fetchModelReport(modelName: string) {
  const encoded = encodeURIComponent(modelName)
  const res = await fetch(
    `${API_BASE}/api/models/${encoded}/report`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (!res.ok) throw new Error('Failed to fetch report')
  return res.json()
}
