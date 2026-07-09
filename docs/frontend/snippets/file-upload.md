---
title: 常见文件上传场景
date: 2023-12-28
icon: wenjianshangchuan
category:
  - practice
tag:
  - frontend
  - 文件上传
---

文件上传是前端开发中常见的需求，不管业务如何复杂，最关键的步骤在于如何获取文件数据，这里介绍几种常见的文件上传场景。

- 选择上传
- 拖拽上传
- 粘贴上传

## 选择上传

### 单文件

通过 `input` 标签的 `type` 属性设置为 `file`，然后监听 `change` 事件，获取文件数据。

::: normal-demo 单文件

```html
<input type="file" />
<div></div>
```

```js
const input = document.querySelector('input')
const div = document.querySelector('div')

const handleFileChange = (e) => {
  e.stopPropagation()
  const inputEle = e.target

  console.log(inputEle.files)

  const files = Array.from(inputEle.files)
  console.log(files)

  files.forEach((file, index) => {
    const fileInfo = `File ${index + 1}: ${file.name} ${file.type} (${
      file.size
    } bytes)`
    div.append(fileInfo)
    // 如果想要其他文件信息，可以通过 file 对象的属性获取
  })

  // 调用通用上传方法
  // upload(files)

  // 防止相同文件上传时不触发 change 事件
  inputEle.value = ''
}

input.addEventListener('change', handleFileChange)
```

:::

### 多文件

通过 `input` 标签的 `multiple` 属性设置为 `true`，然后监听 `change` 事件，获取文件数据。

::: normal-demo 多文件

```html
<input type="file" multiple />
<div></div>
```

```js
const input = document.querySelector('input')
const div = document.querySelector('div')

const handleFileChange = (e) => {
  e.stopPropagation()
  const inputEle = e.target

  console.log(inputEle.files)

  const files = Array.from(inputEle.files)

  files.forEach((file, index) => {
    const fileInfo = `File ${index + 1}: ${file.name} ${file.type} (${
      file.size
    } bytes)`
    div.append(fileInfo)
    // 如果想要其他文件信息，可以通过 file 对象的属性获取
  })

  // 调用通用上传方法
  // upload(files)

  // 防止相同文件上传时不触发 change 事件
  inputEle.value = ''
}

input.addEventListener('change', handleFileChange)
```

:::

### 目录上传

通过 `input` 标签的 `webkitdirectory` 属性设置为 `true`，然后监听 `change` 事件，获取文件数据。

::: normal-demo 目录上传

```html
<input type="file" webkitdirectory />
<div></div>
```

```js
const input = document.querySelector('input')
const div = document.querySelector('div')

const handleFileChange = (e) => {
  e.stopPropagation()
  const inputEle = e.target

  console.log(inputEle.files)

  const files = Array.from(inputEle.files)

  files.forEach((file, index) => {
    const fileInfo = `File ${index + 1}: ${file.name} ${file.type} (${
      file.size
    } bytes)`
    div.append(fileInfo)

    console.log(file)
    // 如果想要其他文件信息，可以通过 file 对象的属性获取
  })

  // 调用通用上传方法
  // upload(files)

  // 防止相同文件上传时不触发 change 事件
  inputEle.value = ''
}

input.addEventListener('change', handleFileChange)
```

:::

## 拖拽上传

选择上传获取文件数据比较简单，下面来看最复杂的文件拖拽上传。

使用 [HTML Drag and Drop API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API) 实现拖拽上传，主要涉及到以下几个事件：

- `dragenter`：拖拽元素进入目标元素时触发；
- `dragover`：拖拽元素在目标元素上移动时触发（每 100 毫秒触发一次）；
- `dragleave`：拖拽元素离开目标元素时触发；
- `drop`：拖拽元素在目标元素上释放时触发。

### 实现拖拽区域交互

首先实现拖拽区域的交互，当拖拽元素进入目标元素时，目标元素的边框变色。

仅需要设置一个 `drag-enter` 类，当拖拽元素进入目标元素时，添加该类，离开时移除该类。

::: react-demo 拖拽区域交互

```js
const { useState } = React

export default () => {
  const [dragEnter, setDragEnter] = useState(false)

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragEnter(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragEnter(false)
  }

  return (
    <div
      className={`drag-area`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ border: dragEnter ? 'none' : undefined }}
    >
      <div
        className={'drag-enter-mask'}
        style={{ display: dragEnter ? 'block' : 'none' }}
      />
      拖拽文件到此区域
    </div>
  )
}
```

```css
.drag-area {
  position: relative;
  min-width: 500px;
  min-height: 300px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  text-align: center;
  font-size: 20px;
  color: #ccc;
}

.drag-enter-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  margin: auto;
  border: 2px dashed #1890ff;
  border-radius: 2px;
  background: rgba(250, 250, 250, 0.5);
  color: #409eff;
}
```

:::

### DataTransfer

`DataTransfer` 对象用于保存拖动并放下过程中的数据。当拖拽元素在目标元素上释放时，需要监听 `onDrop` 事件，获取 `event.dataTransfer.items`。

[`DataTransfer`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer) 接口定义了一些方法和属性：

```ts
interface DataTransfer {
  /**
   * 获取当前选定的拖放操作类型或者设置的为一个新的类型。值必须为 none, copy, link 或 move。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect)
   */
  dropEffect: 'none' | 'copy' | 'link' | 'move'
  /**
   * 提供所有可用的操作类型。必须是 none, copy, copyLink, copyMove, link, linkMove, move, all or uninitialized 之一。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed)
   */
  effectAllowed:
    | 'none'
    | 'copy'
    | 'copyLink'
    | 'copyMove'
    | 'link'
    | 'linkMove'
    | 'move'
    | 'all'
    | 'uninitialized'
  /**
   * 包含数据传输中可用的所有本地文件的列表。如果拖动操作不涉及拖动文件，则此属性为空列表。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/files)
   */
  readonly files: FileList
  /**
   * 提供一个包含所有拖动数据列表的 DataTransferItemList 对象。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/items)
   */
  readonly items: DataTransferItemList
  /**
   * 一个提供 dragstart 事件中设置的格式的 strings 数组。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/types)
   */
  readonly types: ReadonlyArray<string>
  /**
   * 删除与给定类型关联的数据。类型参数是可选的。如果类型为空或未指定，则删除与所有类型关联的数据。如果指定类型的数据不存在，或者 data transfer 中不包含任何数据，则该方法不会产生任何效果。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/clearData)
   */
  clearData(format?: string): void
  /**
   * 检索给定类型的数据，如果该类型的数据不存在或 data transfer 不包含数据，则返回空字符串。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/getData)
   */
  getData(format: string): string
  /**
   * 设置给定类型的数据。如果该类型的数据不存在，则将其添加到末尾，以便类型列表中的最后一项将是新的格式。如果该类型的数据已经存在，则在相同位置替换现有数据。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/setData)
   */
  setData(format: string, data: string): void
  /**
   * 用于设置自定义的拖动图像。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage)
   */
  setDragImage(image: Element, x: number, y: number): void
}
```

::: warning

`DataTransfer.files` 属性只能返回文件列表，因此当拖动文件夹时，只能查看一个文件夹信息。

因此如果拖拽文件夹，需要使用 `dataTransfer.items`，该属性包含一个 `DataTransferItem` 数组。

:::

```diff
  const handleDrop = (e) => {
    e.preventDefault()
    setDragEnter(false)
+   getFileData(e.dataTransfer.items)
  }
```

### 获取文件路径

`DataTransferItemList` 数组中包含 `DataTransferItem` 元素，拖拽几个文件或文件夹则会包含多少个 `DataTransferItem` 对象。

[`DataTransferItem`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransferItem) 接口定义了一些属性和方法：

```ts
interface DataTransferItem {
  /**
   * 拖拽项的种类，string 或是 file。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransferItem/kind)
   */
  readonly kind: string
  /**
   * 拖拽项的类型，一般是一个 MIME 类型。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransferItem/type)
   */
  readonly type: string
  /**
   * 返回一个关联拖拽项的 File 对象（当拖拽项不是一个文件时返回 null）。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransferItem/getAsFile)
   */
  getAsFile(): File | null
  /**
   * 使用拖拽项的字符串作为参数执行指定回调函数。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransferItem/getAsString)
   */
  getAsString(callback: FunctionStringCallback | null): void
  /**
   * 返回一个基于 FileSystemEntry (en-US) 的对象来表示文件系统中选中的项目。通常是返回一个FileSystemFileEntry 或是 FileSystemDirectoryEntry 对象。
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DataTransferItem/webkitGetAsEntry) */
  webkitGetAsEntry(): FileSystemEntry | null
}
```

由于拖拽对象可能是文件也可能是文件夹，因此需要通过该对象上的 [`webkitGetAsEntry()`](https://developer.mozilla.org/docs/Web/API/DataTransferItem/webkitGetAsEntry) 方法，获取 [`FileSystemEnry`](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry) 对象，该对象可能是 [`FileSystemFileEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemFileEntry) 和 [`FileSystemDirectoryEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemDirectoryEntry)。

```js
const getFileData = (items) => {
  if (!items) return

  // 文件或目录路径列表
  const fileEntryList = []

  for (const item of items) {
    const entry = item.webkitGetAsEntry()
    if (entry) {
      fileEntryList.push(entry)
    }
  }

  // 这里上次一个文件夹，三个文件
  // [DirectoryEntry, FileEntry, FileEntry, FileEntry]
  console.log(fileEntryList)
}
```

### 递归获取文件

当获取到所有 `FileSystemEntry` 对象后，即可递归获取文件。

```js
const files = await tranverseFileTree(fileEntryList)
```

在 `traverseFileTree` 函数中，需要解析 `Entry` 获取文件对象：

- 当对象是一个文件时，使用 `file()` 函数获取 `File` 对象；
- 当对象是一个文件夹时，使用 `createReader()` 函数创建一个阅读器，可以读取目录中的所有文件。

::: warning

这两个函数都是异步执行，因此需要使用 `promise`，保证能获取到文件对象。

:::

```js
const traverseFileTree = (fileEntryList) => {
  return new Promise((resolve) => {
    const promises = []

    for (const entry of fileEntryList) {
      if (entry.isFile) {
        // 文件，使用 file() 函数获取文件对象
        promises.push(
          new Promise((resolve) => {
            entry.file((file) => {
              resolve([file])
            })
          })
        )
      } else if (entry.isDirectory) {
        // 文件夹，使用 createReader() 函数获取目录所有文件 entry
        // 然后再递归调用 traverseFileTree 函数
        const dirReader = entry.createReader()
        promises.push(
          new Promise((resolve) => {
            dirReader.readEntries((entries) => {
              resolve(traverseFileTree(entries))
            })
          })
        )
      }
    }

    Promise.all(promises).then((fileList) => {
      resolve(fileList.flat())
    })
  })
}
```

::: react-demo 获取文件数据

```js
const { useState } = React

export default () => {
  const [dragEnter, setDragEnter] = useState(false)
  const [fileList, setFileList] = useState([])

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragEnter(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragEnter(false)

    getFileData(e.dataTransfer.items)
  }

  const traverseFileTree = (fileEntryList) => {
    return new Promise((resolve) => {
      const promises = []

      for (const entry of fileEntryList) {
        if (entry.isFile) {
          // 文件，使用 file() 函数获取文件对象
          promises.push(
            new Promise((resolve) => {
              entry.file((file) => {
                resolve([file])
              })
            })
          )
        } else if (entry.isDirectory) {
          // 文件夹，使用 createReader() 函数获取目录所有文件 entry
          // 然后再递归调用 traverseFileTree 函数
          const dirReader = entry.createReader()
          promises.push(
            new Promise((resolve) => {
              dirReader.readEntries((entries) => {
                resolve(traverseFileTree(entries))
              })
            })
          )
        }
      }

      Promise.all(promises).then((fileList) => {
        // 包含原始目录结构，但是没有目录信息（文件夹名字等）
        resolve(fileList.flat())
      })
    })
  }

  // 获取文件数据
  const getFileData = (items) => {
    if (!items) return

    // 文件或目录路径列表
    const fileEntryList = []

    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      if (entry) {
        fileEntryList.push(entry)
      }
    }

    console.log(fileEntryList, 'entry')
    traverseFileTree(fileEntryList).then((files) => {
      // 如果需要对后缀名进行校验，可以使用 attr-accept 库
      // const invalidFiles = files.filter(
      //   (file) => !validateAccept(file, accept ?? '')
      // )

      setFileList(files.filter((file) => file.name !== '.DS_Store'))

      // 上传等操作
    })
  }

  return (
    <div
      className={`drag-area`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ border: dragEnter ? 'none' : undefined }}
    >
      <div
        className={'drag-enter-mask'}
        style={{ display: dragEnter ? 'block' : 'none' }}
      />
      拖拽文件到此区域，文件数量：{fileList.length}
      <ul>
        {fileList.map((file) => {
          return <li key={file.name}>{file.name}</li>
        })}
      </ul>
    </div>
  )
}
```

```css
.drag-area {
  position: relative;
  min-width: 500px;
  min-height: 300px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  font-size: 20px;
  color: #ccc;
}

.drag-enter-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  margin: auto;
  border: 2px dashed #1890ff;
  border-radius: 2px;
  background: rgba(250, 250, 250, 0.5);
  color: #409eff;
}
```

:::

::: warning

以为拖拽上传就到此结束了吗？当然没有，还有一个 edge case 需要处理。

:::

#### 拖拽文件数量超过 100 处理

当文件夹中文件数量超过 100 个时，`readEntries` 方法只会返回 100 个文件，因此需要递归调用 `readEntries` 方法，直到返回空数组。

```js
// dirReader.readEntries 每次只能读取 100 个文件，所以需要递归读取全部文件
const readAllEntries = (dirReader, items = []) => {
  return new Promise((resolve) => {
    dirReader.readEntries((entries) => {
      if (entries.length) {
        // 如果还有文件，将其添加到 items 列表中并继续读取
        items.push(...entries)
        resolve(readAllEntries(dirReader, items))
      } else {
        // 如果没有更多文件，则完成读取，并返回获取到的全部文件
        resolve(items)
      }
    })
  })
}

const dirReader = entry.createReader()
promises.push(
  readAllEntries(dirReader).then((entries) => {
    return traverseFileTree(entries)
  })
)
```

::: react-demo 拖拽文件数量超过 100 处理

```js
const { useState } = React

export default () => {
  const [dragEnter, setDragEnter] = useState(false)
  const [fileList, setFileList] = useState([])

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragEnter(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragEnter(false)

    getFileData(e.dataTransfer.items)
  }

  const traverseFileTree = (fileEntryList) => {
    return new Promise((resolve) => {
      const promises = []

      for (const entry of fileEntryList) {
        if (entry.isFile) {
          // 文件，使用 file() 函数获取文件对象
          promises.push(
            new Promise((resolve) => {
              entry.file((file) => {
                resolve([file])
              })
            })
          )
        } else if (entry.isDirectory) {
          // 文件夹，使用 createReader() 函数获取目录所有文件 entry
          // 然后再递归调用 traverseFileTree 函数
          const readAllEntries = (dirReader, items = []) => {
            return new Promise((resolve) => {
              dirReader.readEntries((entries) => {
                if (entries.length) {
                  // 如果还有文件，将其添加到 items 列表中并继续读取
                  items.push(...entries)
                  resolve(readAllEntries(dirReader, items))
                } else {
                  // 如果没有更多文件，则完成读取，并返回获取到的全部文件
                  resolve(items)
                }
              })
            })
          }

          const dirReader = entry.createReader()
          promises.push(
            readAllEntries(dirReader).then((entries) => {
              return traverseFileTree(entries)
            })
          )
        }
      }

      Promise.all(promises).then((fileList) => {
        // 包含原始目录结构，但是没有目录信息（文件夹名字等）
        resolve(fileList.flat())
      })
    })
  }

  // 获取文件数据
  const getFileData = (items) => {
    if (!items) return

    // 文件或目录路径列表
    const fileEntryList = []

    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      if (entry) {
        fileEntryList.push(entry)
      }
    }

    console.log(fileEntryList, 'entry')
    traverseFileTree(fileEntryList).then((files) => {
      // 如果需要对后缀名进行校验，可以使用 attr-accept 库
      // const invalidFiles = files.filter(
      //   (file) => !validateAccept(file, accept ?? '')
      // )
      console.log(files, 'fssile')
      setFileList(files.filter((file) => file.name !== '.DS_Store'))

      // 上传等操作
    })
  }

  return (
    <div
      className={`drag-area`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ border: dragEnter ? 'none' : undefined }}
    >
      <div
        className={'drag-enter-mask'}
        style={{ display: dragEnter ? 'block' : 'none' }}
      />
      拖拽文件到此区域，文件数量：{fileList.length}
      <ul>
        {fileList.map((file) => {
          return <li key={file.name}>{file.name}</li>
        })}
      </ul>
    </div>
  )
}
```

```css
.drag-area {
  position: relative;
  min-width: 500px;
  min-height: 300px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  font-size: 20px;
  color: #ccc;
}

.drag-enter-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  margin: auto;
  border: 2px dashed #1890ff;
  border-radius: 2px;
  background: rgba(250, 250, 250, 0.5);
  color: #409eff;
}
```

:::

::: warning

你以为又结束了吗？此时产品跑过来和你说需要保留文件目录结构，但是上面已经说过，`DataTransfer.items` 属性只能返回文件列表，因此需要自己实现文件路径信息。

:::

#### 保留文件目录结构

思考一下如何保留文件目录结构，只需要保留文件目录信息即可，剩下的事情就交给后端进行解析。

看一下拖拽上传后的获取的 `File` 对象，其中的 `webkitRelativePath` 竟然是一个空值：

```js
{
  lastModified: 1691144702000,
  lastModifiedDate: Fri Aug 04 2023 18:25:02 GMT+0800 (中国标准时间) {},
  name:"2083_00008.png",
  size: 118241,
  type: "image/png",
  webkitRelativePath: "",
  [[Prototype]]: File
}
```

::: warning

[`webkitRelativePath`](https://developer.mozilla.org/zh-CN/docs/Web/API/File/webkitRelativePath) 属性记录了文件的路径，但是该属性只有在使用 `input` 上传时才会有值，因此需要自己实现该属性。

:::

那么如何实现该属性，[FileSystemEntry](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry) 对象上会有一个 `name` 属性，记录了路径的名字。

因此只需要在 `traverseFileTree` 函数中，将文件路径信息保存到 `File` 对象上的 `webkitRelativePath` 中即可。

下面看完整实现：

::: react-demo 还原目录结构

```js
const { useState } = React

export default () => {
  const [dragEnter, setDragEnter] = useState(false)
  const [fileList, setFileList] = useState([])

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragEnter(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragEnter(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragEnter(false)

    getFileData(e.dataTransfer.items)
  }

  const traverseFileTree = (fileEntryList, relativePath = '') => {
    return new Promise((resolve) => {
      const promises = []

      for (const entry of fileEntryList) {
        const entryRelativePath = relativePath + entry.name
        if (entry.isFile) {
          // 文件，使用 file() 函数获取文件对象
          promises.push(
            new Promise((resolve) => {
              entry.file((file) => {
                Object.defineProperty(file, 'webkitRelativePath', {
                  value: entryRelativePath,
                  writable: false
                })
                resolve([file])
              })
            })
          )
        } else if (entry.isDirectory) {
          // 文件夹，使用 createReader() 函数获取目录所有文件 entry
          // 然后再递归调用 traverseFileTree 函数
          const readAllEntries = (dirReader, items = []) => {
            return new Promise((resolve) => {
              dirReader.readEntries((entries) => {
                if (entries.length) {
                  // 如果还有文件，将其添加到 items 列表中并继续读取
                  items.push(...entries)
                  resolve(readAllEntries(dirReader, items))
                } else {
                  // 如果没有更多文件，则完成读取，并返回获取到的全部文件
                  resolve(items)
                }
              })
            })
          }

          const dirReader = entry.createReader()
          promises.push(
            readAllEntries(dirReader).then((entries) => {
              return traverseFileTree(entries, entryRelativePath + '/')
            })
          )
        }
      }

      Promise.all(promises).then((fileList) => {
        // 包含原始目录结构，但是没有目录信息（文件夹名字等）
        resolve(fileList.flat())
      })
    })
  }

  // 获取文件数据
  const getFileData = (items) => {
    if (!items) return

    // 文件或目录路径列表
    const fileEntryList = []

    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      if (entry) {
        fileEntryList.push(entry)
      }
    }

    console.log(fileEntryList, 'entry')
    traverseFileTree(fileEntryList).then((files) => {
      // 如果需要对后缀名进行校验，可以使用 attr-accept 库
      // const invalidFiles = files.filter(
      //   (file) => !validateAccept(file, accept ?? '')
      // )
      console.log(files, 'fssile')
      setFileList(files.filter((file) => file.name !== '.DS_Store'))

      // 上传等操作
    })
  }

  return (
    <div
      className={`drag-area`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ border: dragEnter ? 'none' : undefined }}
    >
      <div
        className={'drag-enter-mask'}
        style={{ display: dragEnter ? 'block' : 'none' }}
      />
      拖拽文件到此区域，文件数量：{fileList.length}
      <ul>
        {fileList.map((file) => {
          return <li key={file.name}>{file.webkitRelativePath}</li>
        })}
      </ul>
    </div>
  )
}
```

```css
.drag-area {
  position: relative;
  min-width: 500px;
  min-height: 300px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  font-size: 20px;
  color: #ccc;
}

.drag-enter-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  margin: auto;
  border: 2px dashed #1890ff;
  border-radius: 2px;
  background: rgba(250, 250, 250, 0.5);
  color: #409eff;
}
```

:::

::: warning

到此，拖拽上传就已经全部实现完，但是由于使用的都是最新标准，如果使用 ts 可能会有类型报错：

```shell
error TS2304: Cannot find name 'FileSystemEntry'
```

因此需要自定义类型：

```ts
export interface IFileSystemEntry {
  isFile: boolean
  isDirectory: boolean
  file?: (callback: (file: File) => void) => void
  createReader?: () => any // 为了方便使用 any，也可以创建具体类型
}
```

:::

## 粘贴上传

经历过拖拽上传的痛苦折磨后，实现粘贴上传相信也不在话下了。

只需要监听 `paste` 事件，`clipboardData` 中包含了粘贴的文件数据。

::: react-demo 粘贴上传

```js
const { useState, useRef, useEffect } = React

export default () => {
  const pasteRef = useRef(null)
  const [fileList, setFileList] = useState([])

  const pasteEventListener = (e) => {
    if (!!e.clipboardData?.files?.length) {
      const files = Array.from(e.clipboardData.files)
      setFileList(files)
    }
  }

  useEffect(() => {
    if (pasteRef.current) {
      pasteRef.current.addEventListener('paste', pasteEventListener, false)
    }
    return () => {
      pasteRef.current.removeEventListener('paste', pasteEventListener, false)
    }
  }, [pasteEventListener, pasteRef])

  return (
    <div>
      <div className="paste-area" ref={pasteRef}>
        粘贴文件到此区域，文件数量：{fileList.length}
        <ul>
          {fileList.map((file) => {
            return <li key={file.name}>{file.name}</li>
          })}
        </ul>
      </div>
    </div>
  )
}
```

```css
.paste-area {
  min-width: 500px;
  min-height: 300px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  font-size: 20px;
  color: #ccc;
}
```

:::

::: warning

粘贴上传一般不会有特别复杂的场景，一般是粘贴一个图片或者文件，因此这里没考虑文件夹上传等场景。

:::
