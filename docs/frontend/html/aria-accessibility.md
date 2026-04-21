---
title: ARIA 与无障碍
date: 2026-04-21
icon: accessible
category:
  - Frontend
  - HTML
tag:
  - html
  - accessibility
  - aria
---

## 是什么

ARIA（Accessible Rich Internet Applications）是一组 HTML 属性，帮助屏幕阅读器等辅助技术理解页面内容。

## 核心原则：优先使用语义化 HTML

能用原生元素就不用 ARIA：

```html
<!-- 不推荐 -->
<div role="button" tabindex="0">提交</div>

<!-- 推荐 -->
<button>提交</button>
```

## 常用属性

| 属性 | 用途 |
| :---: | :---: |
| `role` | 定义元素角色（button、dialog、navigation...） |
| `aria-label` | 为元素提供文字说明 |
| `aria-hidden` | 对辅助技术隐藏装饰性元素 |
| `aria-expanded` | 表示折叠/展开状态 |
| `aria-live` | 动态内容更新通知 |

## 典型场景

```html
<!-- 图标按钮需要 label -->
<button aria-label="关闭">✕</button>

<!-- 装饰性图标隐藏 -->
<i class="icon-star" aria-hidden="true"></i>

<!-- 模态框 -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">确认删除</h2>
</div>
```

## 参考

- [MDN - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
