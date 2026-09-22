const normalize = (text) => text.normalize('NFKC').toLowerCase().replace(/[\s\u200b]+/gu, '')

// Whitespace separates keywords; each complete keyword must occur in the
// article's title or content. Do not accept Pagefind's shortened fallback terms.
export function queryKeywords(query) {
  return (query.match(/"[^"]+"|[^\s"]+/gu) || [])
    .map((part) => normalize(part.replace(/^"|"$/gu, '')))
    .filter(Boolean)
}

export async function filterSearchResults(response, query) {
  if (typeof query !== 'string') return response
  const keywords = queryKeywords(query)
  if (!keywords.length) return { ...response, results: [], unfilteredResultCount: 0 }
  const checked = new Array(response.results.length)
  let cursor = 0
  // Limit fragment downloads while preserving the engine's relevance order.
  await Promise.all(Array.from({ length: Math.min(6, response.results.length) }, async () => {
    while (cursor < response.results.length) {
      const position = cursor++
      const result = response.results[position]
      const data = await result.data()
      const text = normalize(`${data.meta?.title || ''}\n${data.content || ''}`)
      if (keywords.every((keyword) => text.includes(keyword))) {
        checked[position] = { ...result, data: async () => data }
      }
    }
  }))
  const results = checked.filter(Boolean)
  return { ...response, results, unfilteredResultCount: results.length }
}
