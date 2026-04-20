---
title: 图片批注
date: 2023-12-28
icon: edit
category:
  - practice
tag:
  - frontend
  - 图片批注
---

::: info

demo: https://codesandbox.io/p/sandbox/image-annotation-pht676?file=%2Fsrc%2FApp.js%3A210%2C56

:::

实现图片批注有两种方案，一种是通过 `SVG` 绘制，一种是通过 `Canvas` 绘制。以下是两者对比：

| 特点       | Canvas                           | SVG                                 |
| ---------- | -------------------------------- | ----------------------------------- |
| 控制级别   | 像素级控制                       | 矢量图形级别控制                    |
| 编辑操作   | 难以直接编辑已绘制的元素         | 易于访问、操作和编辑 DOM 中的元素   |
| 图形类型   | 更适合复杂绘图和动画             | 适合简单图形和图标                  |
| 性能       | 处理大量图形和复杂交互时性能较好 | 处理大规模动态变化时性能较差        |
| 可保存状态 | 绘制后的图像可以保存为图片       | 图像以 XML 格式保存，易于修改和存储 |
| 适用场景   | 复杂交互和动态绘制               | 静态或少量动态变化的图形            |

综上，选择使用 `Canvas` 实现图片批注。

## 加载图片

实现图片批注的第一步是加载图片，这里使用 `FileReader` 读取图片文件，然后将图片绘制到 `Canvas` 上。

这里需要注意的是图片绘制位置，如果图片的宽高比和容器的宽高比不一致，需要根据图片和容器的比例调整绘制位置和大小。

::: warning

这里需要存储当前图片，以便后续绘制批注时使用。

:::

```js
const fillImage = (file) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    const img = new Image()
    // 保存图片副本
    imgRef.current = img
    img.onload = () => {
      drawImageInCanvas(img)
    }
    img.src = e.target.result
  }

  if (file) {
    reader.readAsDataURL(file)
  }
}

const drawImageInCanvas = (img) => {
  const { current: canvas } = canvasRef
  const { current: wrap } = wrapRef

  if (!canvas || !wrap) return

  const ctx = canvas.getContext('2d')

  const imgWidth = img.width
  const imgHeight = img.height
  const wrapWidth = wrap.offsetWidth
  const wrapHeight = wrap.offsetHeight

  // 如果图片的宽高都小于容器的宽高，则保留图片原始尺寸
  if (imgWidth <= wrapWidth && imgHeight <= wrapHeight) {
    canvas.width = imgWidth
    canvas.height = imgHeight
  } else {
    canvas.width = wrapWidth
    canvas.height = wrapHeight

    const imgRatio = imgWidth / imgHeight
    const wrapRatio = wrapWidth / wrapHeight

    // 根据图片和容器的比例关系进行调整
    if (imgRatio >= wrapRatio) {
      canvas.height = wrapWidth / imgRatio
    } else {
      canvas.width = wrapHeight * imgRatio
    }
  }

  // 绘制图像到 Canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}
```

## 绘制批注

定义 `Annotation` 类型，用于描述批注的类型、颜色和坐标点。目前 `type` 只支持 `line` 和 `rectangle` 两种类型，`points` 为坐标点数组，数组长度为 `2`，分别表示起点和终点。

```ts
interface Annotation {
  type: 'line' | 'rectangle'
  color: string
  points: Point[]
}

interface Point {
  x: number
  y: number
}
```

实现绘制批注的方法 `drawAnnotations`，遍历 `annotations` 数组，根据 `type` 绘制批注。

同时需要加入一个 `annotationMode` 状态，用于表示当前绘制的批注类型，当 `annotationMode` 变化时，重新绘制批注。

::: warning

下面两个代码是关键，不能省去，否则在绘制时会出现拖影及图片消失问题。

```js
// 绘制前清空 Canvas
ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
// 重新绘制图片
drawImageInCanvas(imgRef.current)
```

:::

```js
const drawAnnotations = () => {
  if (!annotationMode) return

  const ctx = canvasRef.current.getContext('2d')
  // 绘制前清空 Canvas
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  // 重新绘制图片
  drawImageInCanvas(imgRef.current)

  annotations.forEach((annotation) => {
    ctx.strokeStyle = annotation.color
    // 根据 annotation.type 绘制批注
    switch (annotation.type) {
      case 'line':
        // 绘制线条
        ctx.beginPath()
        ctx.moveTo(annotation.points[0].x, annotation.points[0].y)
        ctx.lineTo(annotation.points[1].x, annotation.points[1].y)
        ctx.stroke()
        break
      case 'rectangle':
        // 绘制矩形框
        ctx.strokeRect(
          annotation.points[0].x,
          annotation.points[0].y,
          annotation.points[1].x - annotation.points[0].x,
          annotation.points[1].y - annotation.points[0].y
        )
        break
      // 其他类型的批注...
      default:
        break
    }
  })
}

useEffect(() => {
  drawAnnotations()
}, [annotations, annotationMode])
```

## 记录起点终点

定义 `isDrawing`、`startPoint` 和 `endPoint` 状态，用于记录是否正在绘制、起点和终点坐标。

在 `mousedown` 事件中记录起点信息，在 `mousemove` 事件中记录终点信息，然后在 `mouseup` 事件中将批注信息添加到 `annotations` 数组中。

::: warning

`mousemove` 事件中需要重复绘制批注信息。

:::

```js
const [isDrawing, setIsDrawing] = useState(false) // 是否正在绘制
const [startPoint, setStartPoint] = useState({ x: 0, y: 0 }) // 绘制起点
const [endPoint, setEndPoint] = useState({ x: 0, y: 0 }) // 绘制终点

// 鼠标点击事件处理程序
const handleMouseDown = (e) => {
  if (!annotationMode) {
    setIsDrawing(false)
    return
  }

  setIsDrawing(true)
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()

  setStartPoint({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  })
}

// 鼠标移动事件处理程序
const handleMouseMove = (e) => {
  if (!annotationMode) {
    setIsDrawing(false)
    return
  }
  if (!isDrawing) return

  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  drawAnnotations()

  // 绘制当前批注的预览效果
  switch (annotationMode) {
    case 'line':
      ctx.beginPath()
      ctx.moveTo(startPoint.x, startPoint.y)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()
      break
    case 'rectangle':
      const width = currentX - startPoint.x
      const height = currentY - startPoint.y
      ctx.strokeRect(startPoint.x, startPoint.y, width, height)
      break
    // 其他类型的批注...
    default:
      break
  }

  // 实时更新终点坐标
  setEndPoint({ x: currentX, y: currentY })
}

// 鼠标释放事件处理程序
const handleMouseUp = (e) => {
  if (!annotationMode) {
    setIsDrawing(false)
    return
  }

  if (isDrawing) {
    setIsDrawing(false)

    // 更新终点坐标
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    setEndPoint({ x: mouseX, y: mouseY })

    // 将绘制的信息添加到 annotations 状态中
    setAnnotations([
      ...annotations,
      {
        type: annotationMode,
        color: 'red',
        points: [startPoint, { x: mouseX, y: mouseY }]
        // 可以添加其他所需信息
      }
    ])
  }
}

// 添加事件监听器
useEffect(() => {
  const { current: canvas } = canvasRef
  if (!canvasRef.current) return
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)
  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown)
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mouseup', handleMouseUp)
  }
}, [annotations, annotationMode, isDrawing])
```

## 图片缩放

使用 `zoomFactorRef` 保存实时缩放比例（使用 state 会拿不到最新值）。监听缩放系数，设置 `canvas` 的样式实现缩放。

```js
const zoomFactorRef = useRef(1)

// 监听鼠标滚轮事件
const handleMouseWheel = (e) => {
  e.preventDefault()
  const { deltaY } = e
  const newScale =
    deltaY > 0
      ? (zoomFactorRef.current * 10 - 0.1 * 10) / 10
      : (zoomFactorRef.current * 10 + 0.1 * 10) / 10
  if (newScale < 0.1 || newScale > 2) return
  zoomFactorRef.current = newScale
}

//监听缩放画布
useEffect(() => {
  const { current: canvas } = canvasRef
  canvas &&
    (canvas.style.transform = `scale(${zoomFactorRef.current},${zoomFactorRef.current})`)
}, [zoomFactorRef.current])
```

## 最终代码

最终代码如下，还存在优化的空间，比如批注历史信息、撤销、重做等。

::: react-demo 图片批注

```js
const { useState, useRef, useEffect } = React

export default () => {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  const [annotations, setAnnotations] = useState([])
  const [annotationMode, setAnnotationMode] = useState()
  const imgRef = useRef(null)

  const [isDrawing, setIsDrawing] = useState(false) // 是否正在绘制
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 }) // 绘制起点
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 }) // 绘制终点
  const [zoomFactor, setZoomFactor] = useState(1) // 缩放系数
  const zoomFactorRef = useRef(1) // 缩放系数

  const fillImage = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      imgRef.current = img
      img.onload = () => {
        drawImageInCanvas(img)
      }
      img.src = e.target.result
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const drawImageInCanvas = (img) => {
    const { current: canvas } = canvasRef
    const { current: wrap } = wrapRef

    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')

    const imgWidth = img.width
    const imgHeight = img.height
    const wrapWidth = wrap.offsetWidth
    const wrapHeight = wrap.offsetHeight

    // 如果图片的宽高都小于容器的宽高，则保留图片原始尺寸
    if (imgWidth <= wrapWidth && imgHeight <= wrapHeight) {
      canvas.width = imgWidth
      canvas.height = imgHeight
    } else {
      canvas.width = wrapWidth
      canvas.height = wrapHeight

      const imgRatio = imgWidth / imgHeight
      const wrapRatio = wrapWidth / wrapHeight

      // 根据图片和容器的比例关系进行调整
      if (imgRatio >= wrapRatio) {
        canvas.height = wrapWidth / imgRatio
      } else {
        canvas.width = wrapHeight * imgRatio
      }
    }

    // 绘制图像到 Canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }

  const handleImageChange = (e) => {
    fillImage(e.target.files[0])
    setAnnotations([])
  }

  const drawAnnotations = () => {
    if (!annotationMode) return

    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    drawImageInCanvas(imgRef.current)

    annotations.forEach((annotation) => {
      ctx.strokeStyle = annotation.color
      // 根据 annotation.type 绘制批注
      switch (annotation.type) {
        case 'line':
          // 绘制线条
          ctx.beginPath()
          ctx.moveTo(annotation.points[0].x, annotation.points[0].y)
          ctx.lineTo(annotation.points[1].x, annotation.points[1].y)
          ctx.stroke()
          break
        case 'rectangle':
          // 绘制矩形框
          ctx.strokeRect(
            annotation.points[0].x,
            annotation.points[0].y,
            annotation.points[1].x - annotation.points[0].x,
            annotation.points[1].y - annotation.points[0].y
          )
          break
        // 其他类型的批注...
        default:
          break
      }
    })
  }

  useEffect(() => {
    drawAnnotations()
  }, [annotations, annotationMode])

  // 鼠标点击事件处理程序
  const handleMouseDown = (e) => {
    if (!annotationMode) {
      setIsDrawing(false)
      return
    }

    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // 鼠标移动事件处理程序
  const handleMouseMove = (e) => {
    if (!annotationMode) {
      setIsDrawing(false)
      return
    }
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    drawAnnotations()

    // 绘制当前批注的预览效果
    switch (annotationMode) {
      case 'line':
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
        break
      case 'rectangle':
        const width = currentX - startPoint.x
        const height = currentY - startPoint.y
        ctx.strokeRect(startPoint.x, startPoint.y, width, height)
        break
      // 其他类型的批注...
      default:
        break
    }

    // 实时更新终点坐标
    setEndPoint({ x: currentX, y: currentY })
  }

  // 鼠标释放事件处理程序
  const handleMouseUp = (e) => {
    if (!annotationMode) {
      setIsDrawing(false)
      return
    }

    if (isDrawing) {
      setIsDrawing(false)

      // 更新终点坐标
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      setEndPoint({ x: mouseX, y: mouseY })

      // 将绘制的信息添加到 annotations 状态中
      setAnnotations([
        ...annotations,
        {
          type: annotationMode,
          color: 'red',
          points: [startPoint, { x: mouseX, y: mouseY }]
          // 可以添加其他所需信息
        }
      ])
    }
  }

  // 监听鼠标滚轮事件
  const handleMouseWheel = (e) => {
    e.preventDefault()
    const { deltaY } = e
    const newScale =
      deltaY > 0
        ? (zoomFactorRef.current * 10 - 0.1 * 10) / 10
        : (zoomFactorRef.current * 10 + 0.1 * 10) / 10
    if (newScale < 0.1 || newScale > 2) return
    setZoomFactor(newScale)
    zoomFactorRef.current = newScale
  }

  //监听缩放画布
  useEffect(() => {
    const { current: canvas } = canvasRef
    canvas &&
      (canvas.style.transform = `scale(${zoomFactorRef.current},${zoomFactorRef.current})`)
  }, [zoomFactorRef.current])

  useEffect(() => {
    const { current: canvas } = canvasRef
    const { current: wrap } = wrapRef
    if (!canvasRef.current) return
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    wrap.addEventListener('wheel', handleMouseWheel)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      wrap.removeEventListener('wheel', handleMouseWheel)
    }
  }, [annotations, annotationMode, isDrawing])

  const handleAnnotationModeChange = (e) => {
    console.log(e.target.value ? e.target.value : undefined, '批注模式')
    setAnnotationMode(e.target.value ? e.target.value : undefined)
  }

  return (
    <>
      <div
        ref={wrapRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          width: '500px',
          backgroundColor: '#edeef0'
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <fieldset style={{ boxSizing: 'border-box', width: 500, marginTop: 10 }}>
        <legend>图片批注</legend>

        <div style={{ marginBottom: 10 }}>
          <input
            type="radio"
            id="none"
            name="type"
            value={undefined}
            checked={annotationMode === undefined}
            onChange={handleAnnotationModeChange}
          />
          <label htmlFor="none">无</label>

          <input
            type="radio"
            id="line"
            name="type"
            value="line"
            checked={annotationMode === 'line'}
            onChange={handleAnnotationModeChange}
          />
          <label htmlFor="line">线</label>

          <input
            type="radio"
            id="rectangle"
            name="type"
            value="rectangle"
            checked={annotationMode === 'rectangle'}
            onChange={handleAnnotationModeChange}
          />
          <label htmlFor="rectangle">框</label>
        </div>

        <input type="file" accept="image/*" onChange={handleImageChange} />
      </fieldset>
    </>
  )
}
```

:::
