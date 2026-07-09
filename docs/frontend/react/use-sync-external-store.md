---
title: useSyncExternalStore
date: 2025-08-05
tags: ["react", "hooks"]
---

不是所有的东西都是用 React 构建的。有很多库和平台 API 是外部于 React 的。将这些东西引入 React 的组件模型和状态管理生命周期是构建全功能应用程序的必要条件。

任务是同步外部世界与 React 组件的内部状态。为此，我们使用 `useSyncExternalStore` 钩子。

让我们以一个组件为例，该组件通过 geolocation API 显示您的当前位置。geolocation API 不是 React 的一部分，因此我们需要同步 geolocation API 的外部状态与组件的内部状态。

```tsx lines=25-28
import { useSyncExternalStore } from 'react'

type LocationData =
	| { status: 'unavailable'; geo?: never }
	| { status: 'available'; geo: GeolocationPosition }
// this variable is our external store!
let location: LocationData = { status: 'unavailable' }

function subscribeToGeolocation(callback: () => void) {
	const watchId = navigator.geolocation.watchPosition((position) => {
		location = { status: 'available', geo: position }
		callback()
	})
	return () => {
		location = { status: 'unavailable' }
		return navigator.geolocation.clearWatch(watchId)
	}
}

function getGeolocationSnapshot() {
	return location
}

function MyLocation() {
	const location = useSyncExternalStore(
		subscribeToGeolocation,
		getGeolocationSnapshot,
	)
	return (
		<div>
			{location.status === 'unavailable' ? (
				'Your location is unavailable'
			) : (
				<>
					Your location is {location.geo.coords.latitude.toFixed(2)}
					{'°, '}
					{location.geo.coords.longitude.toFixed(2)}
					{'°'}
				</>
			)}
		</div>
	)
}
```

基本 API 如下：

```tsx
const snapshot = useSyncExternalStore(
	subscribe,
	getSnapshot,
	getServerSnapshot, // optional
)
```

- `subscribe` 是一个函数，它接受一个回调函数并返回一个清理函数。每当外部存储发生变化时，回调函数都会被调用，让 React 知道应该调用 `getSnapshot` 来获取新值。
- `getSnapshot` 是一个函数，它返回外部存储的当前值。
- `getServerSnapshot` 是一个可选函数，它从服务器返回外部存储的当前值。这对于服务器端渲染和重新水合很有用。如果您不提供此函数，则 React 将在服务器上渲染最近的 `Suspense` 边界 `fallback`，然后当客户端水合时，它将调用 `getSnapshot` 来获取当前值。

参考文档：

- [📜 `useSyncExternalStore` docs](https://react.dev/reference/react/useSyncExternalStore)
- [📜 SSR docs](https://react.dev/reference/react-dom/server)
