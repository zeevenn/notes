---
title: React
article: false
star: true
---

# React

本节记录 React 组件模型、常用 Hook、并发渲染能力和 React DOM 接口。

## 基础

- [React 基础](./fundamentals.md)

## 状态与外部同步

- [useState](./use-state.md)：在组件中保存并更新状态。
- [useReducer](./use-reducer.md)：用 reducer 集中描述状态转换。
- [useEffect](./use-effect.md)：让组件与 React 外部的系统保持同步。
- [useSyncExternalStore](./use-sync-external-store.md)：订阅 React 外部的数据源。

## 引用与标识

- [useRef](./use-ref.md)：保存不参与渲染的数据或引用 DOM 节点。
- [useImperativeHandle](./use-imperative-handle.md)：限制父组件通过 ref 获得的命令式接口。
- [useId](./use-id.md)：生成适合无障碍属性关联的稳定标识。

## 性能与并发渲染

- [useMemo、useCallback 与 memo](./use-memo-callback-memo.md)：缓存计算、函数引用或组件渲染结果。
- [useTransition](./use-transition.md)：把非紧急状态更新标记为 Transition。
- [useDeferredValue](./use-deferred-value.md)：延迟更新界面中的非紧急部分。
- [useOptimistic](./use-optimistic.md)：在异步操作完成前展示乐观状态。
- [Suspense](./suspense.md)：为等待中的子树展示后备界面。

## React DOM

- [Portal](./create-portal.md)：把子节点渲染到当前 DOM 层级之外。
- [flushSync](./flush-sync.md)：强制 React 同步提交指定更新。
