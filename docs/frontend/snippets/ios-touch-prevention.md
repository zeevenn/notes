---
title: iOS 阻止 touch 事件默认行为
date: 2024-09-11
icon: prevent-touch
category:
  - practice
tag:
  - 兼容
---

webview 开发时，iOS 中 safari 浏览器通过 `preventDefault` 方法来阻止默认行为。

```ts{16}
import { useEffect } from 'react'

const usePreventTouchEvent = <T extends HTMLElement = HTMLDivElement>(containerRef: React.RefObject<T>) => {
  useEffect(() => {
    const preventDefaultBehavior = (event: Event): void => {
      event.preventDefault()
    }

    const touchEvents: string[] = ['touchmove']

    const dragContainer = containerRef.current

    if (dragContainer) {
      touchEvents.forEach((eventType: string) => {
        dragContainer.addEventListener(eventType, preventDefaultBehavior, {
          passive: false
        })
      })

      return () => {
        touchEvents.forEach((eventType: string) => {
          dragContainer.removeEventListener(eventType, preventDefaultBehavior)
        })
      }
    }
  }, [containerRef])
}

export default usePreventTouchEvent
```

::: warning

在 iOS 上，需要增加 `{ passive: false }` 参数，否则会导致 `touch` 事件的 `preventDefault()` 行为失效。

详细见：[addEventListener#passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive)。

:::
