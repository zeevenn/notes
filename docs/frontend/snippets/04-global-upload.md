---
title: 全局上传组件
date: 2023-11-22
icon: shangchuan
category:
  - practice
tag:
  - frontend
  - 图片批注
---

上传需要涉及到各个页面，因此需要实现一个全局上传组件，同时支持拖拽上传。

根据产品 PRD，整理出如下几个重点部分：

1. 管理全局的上传任务状态
2. 文件上传需要绑定每次上传任务的回调
3. 拖拽内容区域上传
4. 上传文件时进度以文件夹为单位进行展示

## 管理全局的上传任务状态

第一个问题可以使用 Context 或着 Redux 解决，在这里由于没有涉及到其他更复杂的状态管理，因此使用更轻量的 Context。

每当添加上传任务，都可以通过 Context 提供的方法更新状态，同时所有引用了此状态的组件（如全局上传抽屉）都会被重新渲染以显示最新的状态。

在切换页面时需要保留全局上传组件的状态。 因此应将其定义在一个比页面组件生命周期更长的地方，页面切换时，只是 `Router` 的子组件（即页面组件）在发生变化，而 `Router` 和它的父组件 `App` 并未发生变化，也就不会触发重新渲染。

```tsx
<UploadContextProvider>
  <AppRouting />
  <GlobalUploadDrawer />
</UploadContextProvider>
```

这样，在全局上传组件被创建后，就会一直存在，即使页面发生切换。同时，由于它包裹在 `UploadContextProvider` 下面，能够随时读取和更新全局的上传状态。

## 绑定对应回调

在上传任务的处理中，最初将上传任务交给 `UploadContext` 处理：

```tsx
interface UploadCallbackType {
  onStartCallback?: (data: ZdtUploaderOutput) => void
  onProgressCallback?: (data: ZdtUploaderOutput) => void
  onSuccessCallback?: (data: ZdtUploaderOutput) => void
  onFailCallback?: (data: ZdtUploaderOutput) => void
}

interface UploadContextType {
  uploadFiles: UploadFile[]
  handleUpload: (files: File[], callback: UploadCallbackType) => void
  handleCancel: (file: File) => void
}

export const UploadContext = createContext<UploadContextType>({
  uploadFiles: [],
  handleUpload: () => {},
  handleCancel: () => {}
})

interface UploadContextProviderProps {}

export const UploadContextProvider: FC<UploadContextProviderProps> = ({
  children
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])

  // 这里需要生成十个 ref
  const uploaderRef = useRef<ZdtUploaderRef>(null)

  const uploadTaskRef =
    useRef<Map<ZdtUploaderOutput | null, UploadCallbackType>>() // 上传任务队列

  const handleUpload = (files: File[], callback: UploadCallbackType) => {
    const taskId = `${Date.now()}`
    uploadTaskRef.current[taskId] = {
      data: null, // 上传任务开始之前的文件数据我们先设置为null
      callback
    }

    uploaderRef.current?.upload(files)
  }

  const handleCancel = (file: File) => {
    // 这里添加取消文件上传的逻辑
  }

  const uploadBatchFilesStart = (data: ZdtUploaderOutput) => {}

  const onUploadProgress = (data: ZdtUploaderOutput) => {}

  const uploadBatchFilesSuccess = (data: ZdtUploaderOutput) => {}

  const uploadBatchFilesFailed = (data: ZdtUploaderOutput) => {}

  return (
    <UploadContext.Provider
      value={{
        uploadFiles,
        handleUpload,
        handleCancel
      }}
    >
      {children}
      // 这里生成十个组件
      <ZdtUploaderBtn
        ref={uploaderRef}
        showProgress={false}
        multiple
        onUploadSuccess={uploadBatchFilesSuccess}
        onUploadFailed={uploadBatchFilesFailed}
        onUploadStart={uploadBatchFilesStart}
        onUploadProgress={onUploadProgress}
      />
    </UploadContext.Provider>
  )
}
```

但是经过仔细思考后，这种方案将 `ZdtUploaderBtn` 直接定义好，很自定义其他属性。

因此，上传组件应该由页面自己决定，而 `upload-context` 只负责管理上传文件的状态，只需提供 `createUploader` 方法供页面调用，这样就能避免复杂的属性绑定。

子页面传入 `ZdtUploaderBtnProps`，可以很方便地自定义上传组件属性。

这样，子页面每次调用 createUploader，**页面上都会创建一个由该子页面定义的上传组件**，同时每个上传任务的文件由 Map 存储起来，这样在触发回调更新上传文件时，可以保证一一对应。

```tsx
interface UploadContextType {
  uploadFilesMap: Map<number, UploadFile[]> // 上传文件对象
  createUploader: (
    props: ZdtUploaderBtnProps,
    files?: File[],
    groupLayer?: number
  ) => void // 初始化 uploader
}

export const UploadContext = createContext<UploadContextType>({
  uploadFilesMap: new Map(),
  createUploader: () => {}
})

export const UploadContextProvider: FC = ({ children }) => {
  const [uploadFilesMap, setUploadFilesMap] = useState<
    Map<number, UploadFile[]>
  >(new Map())

  const updateFileMap = (data: ZdtUploaderOutput, index: number) => {
    setUploadFilesMap((oldFilesMap) => {
      const newFilesMap = new Map(oldFilesMap)
      newFilesMap.set(index, data.nzFiles!)
      return newFilesMap
    })
  }

  // 由外部设置 uploader
  const [uploaders, setUploaders] = useState<ReactNode[]>([])
  const uploaderRef = useRef<ZdtUploaderRef>(null)

  /**
   * 自定义 ZdtUploaderBtn
   * @param props ZdtUploaderBtnProps
   */
  const createUploader = (props: ZdtUploaderBtnProps) => {
    const element = (
      <ZdtUploaderBtn
        ref={uploaderRef}
        key={Date.now()}
        subDirectory={'' + generateUniqString() + '/'}
        showProgress={false}
        multiple
        onUploadStart={(data) => {
          updateFileMap(data, uploaders.length)
          props.onUploadStart?.(data)
        }}
        onUploadProgress={(data) => {
          updateFileMap(data, uploaders.length)
          props.onUploadProgress?.(data)
        }}
        onUploadSuccess={(data) => {
          updateFileMap(data, uploaders.length)
          props.onUploadSuccess?.(data)
        }}
        onUploadFailed={(data) => {
          updateFileMap(data, uploaders.length)
          props.onUploadFailed?.(data)
        }}
        {...props}
      />
    )

    setUploaders((olduploaders) => [...olduploaders, element])

    // 保证组件 ref 成功绑定
    setTimeout(() => {
      uploaderRef.current?.select()
    }, 0)
  }

  return (
    <UploadContext.Provider
      value={{
        uploadFilesMap,
        createUploader
      }}
    >
      {children}
      {uploaders}
    </UploadContext.Provider>
  )
}
```

![整体架构](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/image-20231127194832077.png)

## 支持内容区域拖拽上传

由于内容区域拖拽上传也需要接入全局上传抽屉，而 `upload-context` 提供的 `createUploader` 方法，内部原理是调用 `uploaderRef.select()` 唤起文件选择器进行上传，无法实现拖拽上传。

因此需要修改 `createUploader` 方法，支持获取文件后直接上传：

```tsx
// 拖拽上传需要监听 onDrop 事件传入 files 数组
const createUploader = (props: ZdtUploaderBtnProps, files?: File[]) => {
  const element = (
    <ZdtUploaderBtn
      ...
    />
  );

  setUploaders((olduploaders) => [...olduploaders, element]);

  if (files) {
    uploaderRef.current?.upload(files);
  } else {
    setTimeout(() => {
      uploaderRef.current?.select();
    }, 0);
  }
};
```

接下来需要自定义一个 `global-drag-uploader` 组件，监听 `onDrop` 事件获取拖拽的所有文件夹，并调用 `createUploader` 方法。

在该方法中，需要实现 `directory` 和 `accept` 属性校验方法。

因此，最终代码如下：

```tsx
import type { FC } from 'react'
import { useContext, useState } from 'react'
import validateAccept from 'attr-accept'

import { ZdtUploaderBtnProps, shortToast } from '@yuanfudao/zdt-react'

import { UploadContext } from '../../context/upload-context'
import styles from './global-drag-uploader.module.scss'

export interface IFileSystemEntry {
  isFile: boolean
  isDirectory: boolean
  file?: (callback: (file: File) => void) => void
  createReader?: () => any // 或创建具体类型，例如： { readEntries: (callback: (entries: MyFileSystemEntry[]) => void) => void };
}

interface GlobalDragUploader {
  uploaderProps: ZdtUploaderBtnProps
}

export const GlobalDragUploader: FC<GlobalDragUploader> = (props) => {
  const { directory, accept } = props.uploaderProps
  const { children } = props

  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const { createUploader } = useContext(UploadContext)

  async function traverseFileTree(
    fileEntryList: any,
    relativePath = ''
  ): Promise<File[]> {
    return new Promise((resolve) => {
      const promises: Promise<File[]>[] = []

      for (const entry of fileEntryList) {
        const entryRelativePath = relativePath + (entry.name as string)
        if (entry.isFile) {
          promises.push(
            new Promise((resolve) => {
              entry.file((file: File) => {
                Object.defineProperty(file, 'webkitRelativePath', {
                  value: entryRelativePath,
                  writable: false
                })
                resolve([file])
              })
            })
          )
        } else if (entry.isDirectory) {
          // dirReader.readEntries 每次只能读取 100 个文件，所以需要递归读取全部文件
          const readAllEntries = async (
            dirReader: any,
            items: any[] = []
          ): Promise<any[]> => {
            return new Promise((resolve) => {
              dirReader.readEntries(async (entries: any) => {
                if (entries.length) {
                  // 如果还有文件，将其添加到 items 列表中并继续读取
                  items.push(...entries)
                  resolve(await readAllEntries(dirReader, items))
                } else {
                  // 如果没有更多文件，则完成读取，并返回获取到的全部文件
                  resolve(items)
                }
              })
            })
          }

          const dirReader = entry.createReader()
          promises.push(
            readAllEntries(dirReader).then(async (entries) => {
              return traverseFileTree(entries, entryRelativePath + '/')
            })
          )
        }
      }

      Promise.all(promises).then((fileList) => {
        resolve(fileList.flat())
      })
    })
  }

  async function onDrop(event: React.DragEvent<HTMLDivElement>) {
    setIsDragOver(false)
    event.preventDefault()

    // 获取文件
    const items = event.dataTransfer?.items
    const fileEntryList: IFileSystemEntry[] = []

    if (!items) return

    for (const item of items) {
      const entry = item.webkitGetAsEntry()
      if (directory && !entry?.isDirectory) {
        shortToast.error({
          message: '上传类型错误',
          description: `请上传文件夹`
        })
        return
      }
      if (!directory && !entry?.isFile) {
        shortToast.error({ message: '上传类型错误', description: `请上传文件` })
        return
      }
      if (entry) {
        fileEntryList.push(entry)
      }
    }

    const files = await traverseFileTree(fileEntryList)

    // // 这里要对拖拽上传图片做一个后缀和accept匹配的校验
    if (files.some((file) => !validateAccept(file, accept ?? ''))) {
      shortToast.error({
        message: '上传格式错误',
        description: `请上传${accept}格式文件`
      })
    }

    // 过滤 .DS_Store
    const fileList = files.filter((file) => file.name !== '.DS_Store')

    // 上传
    createUploader(props.uploaderProps, fileList)
    // refUploader.current?.upload(multiple ? fileList : fileList[0] ? [fileList[0]] : []);
  }

  return (
    <div
      className="relative"
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
    >
      <div
        className={styles['drag-cover']}
        style={{ display: isDragOver ? 'block' : 'none' }}
        onDrop={onDrop}
        onDragEnter={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => {
          setIsDragOver(false)
        }}
      />
      {children}
    </div>
  )
}

GlobalDragUploader.defaultProps = {
  uploaderProps: {
    directory: false,
    multiple: true
  }
}
```

::: info

拖拽上传详细实现过程见 [常见文件上传场景](003-file-upload.md)

:::

## 全局上传支持以文件夹为单位展示进度

需要以文件夹层级为单位展示进度，最开始直接平铺 `uploadFilesMap` 方案无法实现。

然而由于使用全局上传，上传抽屉写在 `App.tsx` 中，因此很难支持传入 `props` 自定义以何种层级展示文件上传进度，只能以第一级为单位展示文件进度。

所以 `upload-context` 中还需要提供 `groupLayersMap`，支持页面自定义展示层级。

```diff
- const createUploader = (props: ZdtUploaderBtnProps, files?: File[]) => {
+ const createUploader = (props: ZdtUploaderBtnProps, files?: File[], groupLayer?: number) => {
  const element = (
    <ZdtUploaderBtn
      ref={uploaderRef}
      key={Date.now()}
      subDirectory={'' + generateUniqString() + '/'}
      showProgress={false}
      multiple
      onUploadStart={(data) => {
        updateFileMap(data, uploaders.length);

+       // 设置展示层级，默认展示根路径
+       setGroupLayersMap((oldGroupLayersMap) => {
+         const newGroupLayersMap = new Map(oldGroupLayersMap);
+         newGroupLayersMap.set(uploaders.length, groupLayer ?? 1);
+         return newGroupLayersMap;
+       });

        props.onUploadStart?.(data);
      }}
      ...
```

修改全局上传抽屉组件：

```diff
  export const GlobalUploadDrawer: FC = () => {
-   const uploadFiles = flatten(Array.from(uploadFilesMap.values())).reverse();
+   const groupedUploadFiles = groupByFolder(uploadFilesMap, groupLayersMap);
```

`UploadFilesMap` 中仅包含平铺后的文件信息，无法直接识别上传的文件属于文件夹还是文件，所以需要利用 `webkitRelativePath` 判断，若为空则为文件，若不为空则属于文件夹。

同时，分组逻辑应为 `taskId + '-' + groupLayersMap.get(taskId).join('/')` 保证每个任务下的文件夹独立。

```tsx
const groupByFolder = (
  uploadFilesMap: Map<number, UploadFile[]>,
  groupLayersMap: Map<number, number>
) => {
  const folders: Record<
    string,
    { total: number; percent: number; uid: string; name: string }
  > = {}

  uploadFilesMap.forEach((uploadFiles, taskId) => {
    uploadFiles.forEach((file) => {
      // 判断文件属于文件夹内还是文件
      // @ts-expect-error
      const relativePath = file.originFileObj!.webkitRelativePath
      const pathParts = relativePath ? relativePath.split('/') : [file.name]

      const folder =
        taskId + '-' + pathParts.slice(0, groupLayersMap.get(taskId)).join('/')
      const name = pathParts.slice(0, groupLayersMap.get(taskId)).join('')

      if (!folders[folder]) {
        folders[folder] = { total: 0, percent: 0, uid: folder, name }
      }

      folders[folder]!.total++
      folders[folder]!.percent += file.percent!
    })
  })

  // reverse 保证最新的任务在最上方
  return Object.keys(folders)
    .reverse()
    .map((folder) => {
      return {
        name: folders[folder]?.name,
        percent: folders[folder]!.percent / folders[folder]!.total,
        uid: folders[folder]?.uid
      }
    })
}
```
