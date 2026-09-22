<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vuepress/client'
import '@pagefind/default-ui/css/ui.css'

const dialog = ref<HTMLDialogElement>()
const searchHost = ref<HTMLElement>()
const resultHint = ref('多个关键词可用空格分隔')
let cleanupAutoLoad: (() => void) | undefined
const loading = ref(false)
const error = ref(false)
const isDevelopment = import.meta.env.DEV
let searchUI: { destroy: () => void } | undefined
let previousOverflow = ''

// Keep Pagefind's result rendering and pagination; request another page when
// the scroll container approaches its end. The adapter targets the pinned UI version.
function setupAutoLoad() {
  const host = searchHost.value
  const scroller = host?.querySelector<HTMLElement>('.pagefind-ui__drawer')
  if (!host || !scroller) return
  let frame = 0
  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const more = host.querySelector<HTMLButtonElement>('.pagefind-ui__button')
      const hasResults = !!host.querySelector('.pagefind-ui__result')
      resultHint.value = more ? '向下滚动，自动加载更多' : hasResults ? '已显示全部结果' : '多个关键词可用空格分隔'
      if (!more) return
      more.tabIndex = -1
      more.setAttribute('aria-hidden', 'true')
      if (!dialog.value?.open || !scroller.clientHeight || host.querySelector('.pagefind-ui__loading')) return
      if (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 160) more.click()
    })
  }
  const resetScroll = (event: Event) => {
    if ((event.target as HTMLElement).matches('.pagefind-ui__search-input')) scroller.scrollTop = 0
  }
  const observer = new MutationObserver(schedule)
  observer.observe(host, { childList: true, subtree: true, characterData: true })
  scroller.addEventListener('scroll', schedule, { passive: true })
  host.addEventListener('input', resetScroll)
  schedule()
  cleanupAutoLoad = () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    scroller.removeEventListener('scroll', schedule)
    host.removeEventListener('input', resetScroll)
  }
}

async function openSearch() {
  if (!dialog.value || dialog.value.open) return
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  if (isDevelopment) return
  if (!searchUI) {
    loading.value = true
    error.value = false
    try {
      // Search assets are generated after VuePress builds the site.
      const response = await fetch(withBase('/pagefind/pagefind-entry.json'), {
        signal: AbortSignal.timeout(8000)
      })
      if (!response.ok) throw new Error('Search index unavailable')
      // A development server or SPA fallback can return HTML with status 200.
      const manifest = await response.json()
      if (typeof manifest.version !== 'string' || !manifest.languages?.zh?.hash) {
        throw new Error('Invalid search index')
      }
      const { PagefindUI } = await import('@pagefind/default-ui')
      if (!dialog.value) return
      searchUI = new PagefindUI({
        element: '#pagefind-search',
        bundlePath: withBase('/search/'),
        baseUrl: withBase('/'),
        showSubResults: true,
        showImages: false,
        excerptLength: 24,
        translations: {
          language: 'zh-CN',
          placeholder: '搜索标题、正文或代码关键词',
          clear_search: '清空',
          load_more: '加载更多结果',
          search_label: '全文搜索',
          searching: '正在搜索 [SEARCH_TERM]…',
          zero_results: '没有找到“[SEARCH_TERM]”',
          one_result: '找到 [COUNT] 条关于“[SEARCH_TERM]”的结果',
          many_results: '找到 [COUNT] 条关于“[SEARCH_TERM]”的结果',
          total_one_result: '[COUNT] 条结果',
          total_many_results: '[COUNT] 条结果',
          alt_search: '没有找到“[SEARCH_TERM]”，以下是“[DIFFERENT_TERM]”的结果',
          search_suggestion: '没有找到“[SEARCH_TERM]”，试试其他关键词。'
        }
      })
      await nextTick()
      setupAutoLoad()
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }
  await nextTick()
  if (dialog.value?.open) {
    dialog.value.querySelector<HTMLInputElement>('input')?.focus()
  }
}

function closeSearch() {
  dialog.value?.close()
}

function restoreScroll() {
  document.body.style.overflow = previousOverflow
}

function onKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    void openSearch()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (dialog.value?.open) restoreScroll()
  cleanupAutoLoad?.()
  searchUI?.destroy()
})
</script>

<template>
  <div class="fulltext-search">
    <button class="fulltext-search-trigger" type="button" aria-label="全文搜索" @click="openSearch">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </svg>
      <span>搜索</span>
      <kbd>⌘ / Ctrl K</kbd>
    </button>
    <dialog ref="dialog" class="fulltext-search-dialog" aria-labelledby="fulltext-search-title" data-pagefind-ignore @close="restoreScroll" @click="event => event.target === dialog && closeSearch()">
      <section class="fulltext-search-panel">
        <header class="fulltext-search-header">
          <h2 id="fulltext-search-title">全文搜索</h2>
          <button type="button" aria-label="关闭搜索" @click="closeSearch">关闭 <kbd>Esc</kbd></button>
        </header>
        <p v-if="loading" role="status">正在加载搜索…</p>
        <div v-if="isDevelopment" role="status">
          <p>开发模式未提供全文搜索索引，请使用构建预览进行搜索。</p>
          <p>运行 <code>pnpm run build</code>，再运行 <code>pnpm run preview</code>，打开命令输出的预览地址。</p>
        </div>
        <p v-if="error" role="alert">搜索暂时不可用，请稍后重新打开。</p>
        <div id="pagefind-search" ref="searchHost" />
        <footer v-if="!isDevelopment && !loading && !error" class="fulltext-search-footer">
          <span>{{ resultHint }}</span>
          <span><kbd>Esc</kbd> 关闭</span>
        </footer>
      </section>
    </dialog>
  </div>
</template>

<style>
.fulltext-search-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 0.5rem;
  background: var(--bg-color-secondary, #f5f5f5);
  color: var(--text-color, #333);
  cursor: pointer;
}
.fulltext-search-trigger kbd { font-size: 0.7rem; opacity: 0.65; }
.fulltext-search-dialog {
  --pagefind-ui-primary: var(--theme-color, #3eaf7c);
  --pagefind-ui-text: var(--text-color, #333);
  --pagefind-ui-background: var(--bg-color, #fff);
  --pagefind-ui-border: var(--border-color, #ddd);
  --pagefind-ui-font: inherit;
  --pagefind-ui-scale: 0.8;
  box-sizing: border-box;
  position: fixed;
  width: min(720px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  max-height: 86dvh;
  margin: 7dvh auto 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 16px;
  background: var(--bg-color, #fff);
  color: var(--text-color, #333);
  white-space: normal;
  overflow-wrap: anywhere;
  box-shadow: 0 24px 80px #0003;
}
.fulltext-search-dialog::backdrop { background: #0f172a80; backdrop-filter: blur(3px); }
.fulltext-search-dialog * { box-sizing: border-box; }
.fulltext-search-panel { min-width: 0; padding: 20px 20px 0; }
.fulltext-search-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.fulltext-search-header h2 { margin: 0; padding: 0; border: 0; font-size: 16px; font-weight: 600; }
.fulltext-search-header button { padding: 4px 6px; border: 0; border-radius: 5px; background: transparent; color: inherit; font-size: 12px; cursor: pointer; opacity: 0.75; }
.fulltext-search-header button:hover { background: var(--bg-color-secondary, #f5f5f5); opacity: 1; }
.fulltext-search-header kbd { margin-left: 6px; }
.fulltext-search-dialog kbd { border: 1px solid var(--border-color, #ddd); border-radius: 4px; padding: 1px 4px; font-size: 11px; box-shadow: none; }
#pagefind-search .pagefind-ui__search-input {
  height: 48px;
  min-width: 0;
  border-width: 1px;
  border-radius: 9px;
  font-size: 16px;
  font-weight: 400;
  padding-left: 42px;
}
#pagefind-search .pagefind-ui__search-input:focus { outline: 2px solid var(--theme-color, #3eaf7c); outline-offset: 1px; }
#pagefind-search .pagefind-ui__search-input::placeholder { opacity: 0.55; }
#pagefind-search .pagefind-ui__form::before { top: 17px; left: 16px; width: 15px; height: 15px; }
#pagefind-search .pagefind-ui__search-clear { top: 4px; right: 4px; height: 40px; font-size: 12px; }
#pagefind-search .pagefind-ui__drawer {
  display: block;
  min-width: 0;
  max-height: min(560px, calc(86dvh - 168px));
  margin-top: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  padding-right: 8px;
}
#pagefind-search .pagefind-ui__results-area { min-width: 0; width: 100%; margin: 0; }
#pagefind-search .pagefind-ui__message { height: auto; margin: 0; padding: 8px 0 12px; font-size: 12px; line-height: 1.6; font-weight: 400; opacity: 0.7; }
#pagefind-search .pagefind-ui__results { margin: 0; padding: 0; }
#pagefind-search .pagefind-ui__result { min-width: 0; padding: 16px 0; border-width: 1px; }
#pagefind-search .pagefind-ui__result:last-of-type { border-bottom: 0; }
#pagefind-search .pagefind-ui__result-inner { min-width: 0; width: 100%; max-width: 100%; margin: 0; align-items: stretch; }
#pagefind-search .pagefind-ui__result-title { display: block; max-width: 100%; font-size: 16px; line-height: 1.6; font-weight: 600; }
#pagefind-search .pagefind-ui__result-link { white-space: normal; overflow-wrap: anywhere; }
#pagefind-search .pagefind-ui__result-title .pagefind-ui__result-link:hover { color: var(--theme-color, #3eaf7c); text-decoration: none; }
#pagefind-search .pagefind-ui__result-excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-width: 100%;
  margin: 5px 0 0;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.75;
  font-size: 13px;
  opacity: 0.85;
}
#pagefind-search .pagefind-ui__result-nested { min-width: 0; margin-top: 12px; padding: 0 0 0 12px; border-left: 2px solid var(--border-color, #ddd); }
#pagefind-search .pagefind-ui__result-nested:first-of-type { padding-top: 0; }
#pagefind-search .pagefind-ui__result-nested .pagefind-ui__result-title { font-size: 13px; }
#pagefind-search .pagefind-ui__result-nested .pagefind-ui__result-link { font-size: inherit; }
#pagefind-search .pagefind-ui__result-nested .pagefind-ui__result-link::before { content: none; }
.fulltext-search-dialog mark { padding: 0 2px; border-radius: 3px; color: inherit; background: color-mix(in srgb, var(--theme-color, #3eaf7c) 22%, transparent); font-weight: 600; }
/* Retain the UI's pagination control as a non-interactive sentinel. */
#pagefind-search .pagefind-ui__button { display: block; height: 1px; min-height: 0; margin: 0; padding: 0; border: 0; overflow: hidden; opacity: 0; pointer-events: none; }
.fulltext-search-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--border-color, #ddd); font-size: 11px; opacity: 0.65; }
@media (max-width: 719px) {
  .fulltext-search-trigger kbd { display: none; }
  .fulltext-search-dialog { width: calc(100vw - 24px); max-width: calc(100vw - 24px); max-height: 90dvh; margin-top: 4dvh; border-radius: 12px; }
  .fulltext-search-panel { padding: 16px 14px 0; }
  #pagefind-search .pagefind-ui__drawer { max-height: calc(90dvh - 168px); padding-right: 4px; }
}
</style>
