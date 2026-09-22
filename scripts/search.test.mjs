import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

// Exercise the actual generated Chinese index and Pagefind WASM engine.
// These tests require pnpm run build; fetch reads the built assets locally.
globalThis.document = { currentScript: null, querySelector: () => ({ getAttribute: () => 'zh-CN' }) }
globalThis.fetch = async (input) => {
  const url = new URL(input)
  assert.equal(url.origin, 'http://pagefind.test')
  assert.ok(url.pathname.startsWith('/pagefind/'))
  const data = await readFile(new URL(`../docs/.vuepress/dist${url.pathname}`, import.meta.url))
  return new Response(data)
}
const { createInstance } = await import('../docs/.vuepress/dist/pagefind/pagefind.js')
const engine = createInstance({ basePath: 'http://pagefind.test/pagefind/', baseUrl: '/notes/', noWorker: true })

test('default Pagefind search finds Chinese titles, body/code keywords and multi-keyword matches', async () => {
  for (const [query, expected] of [
    ['事件循环', '事件循环'],
    ['原型链', '原型与原型链'],
    ['中间件', '中间件模式'],
    ['微任务检查点', '事件循环'],
    ['queueMicrotask', '事件循环'],
    ['缓存 协商', 'HTTP 缓存'],
    ['舒服', '当你编码时']
  ]) {
    const results = await engine.search(query)
    assert.ok(results.results.length, query)
    assert.equal((await results.results[0].data()).meta.title, expected, query)
  }
})

test.after(() => engine.destroy())
