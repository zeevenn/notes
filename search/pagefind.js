import * as pagefind from '../pagefind/pagefind.js'
import { filterSearchResults } from './keyword-match.js'

export { options, init, filters, preload, mergeIndex, destroy } from '../pagefind/pagefind.js'

export async function search(query, options) {
  return filterSearchResults(await pagefind.search(query, options), query)
}
