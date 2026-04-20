---
title: dnd-kit 踩坑
date: 2023-11-23
icon: tuozhuai
category:
  - practice
tag:
  - frontend
  - 拖拽排序
  - dnd kit
---

@dnd-kit - 用于 React 的轻量级、模块化、高性能、可访问和可扩展的拖放工具包。

## Context Provider

```tsx
const SortableItem = (props: {
  id: string
  itemRender: () => ReactElement
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition!,
    cursor: 'move'
  }
  return (
    <div
      className="mr-2"
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
    >
      {props.itemRender()}
    </div>
  )
}
```

## 踩坑

### dnd kit 会将鼠标点击事件识别为拖拽事件

https://github.com/clauderic/dnd-kit/issues/1204

https://github.com/clauderic/dnd-kit/issues/893

需要注册一些传感器：

```js
const sensor = useSensor(PointerSensor, {
  activationConstraint: { distance: 10 }
})
```

### 条件拖拽

让元素在某些条件下允许排序：

```js
const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: props.id, disabled: props.disabled })
```

### video 元素无法被拖拽

外层包裹一个 `div`。

```tsx
<div
  className={style.videoItem}
  onMouseEnter={() => {
    videoRef.current?.play()
  }}
  onMouseLeave={() => {
    videoRef.current?.pause()
  }}
>
  <video
    ref={videoRef}
    src={props.resource.resourceUrl}
    controls
    className={style.video}
    muted
    loop
  >
    <track kind="captions" {...props} />
  </video>
</div>
```

### 拖拽动画异常

排序策略

需要选择默认

### 无限拖拽出现滚动条

```js
modifiers={[restrictToFirstScrollableAncestor]}
```

### 鼠标跟手

https://github.com/clauderic/dnd-kit/issues/122
https://github.com/clauderic/dnd-kit/pull/334

https://github.com/clauderic/dnd-kit/blob/master/stories/components/Draggable/DraggableOverlay.tsx
