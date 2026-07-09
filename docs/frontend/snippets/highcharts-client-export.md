---
title: HighCharts 客户端导出图片
date: 2024-01-23
icon: highcharts
category:
  - practice
tag:
  - highcharts
---

客户端导出指的是不需要提交数据到导出服务器，直接在浏览器上可以将图表导出为常见图片文件或 PDF 文档。以下情况非常适合使用客户端导出：

- 不希望将图表数据或图表配置发送到我们的导出服务器
- 希望省去自己配置导出服务器
- 不需要在低版本 IE （IE9 及以下）浏览器上使用导出功能

## 客户端导出

客户端导出功能模块使用现代浏览器技术来完成相关的功能，因此某些功能在低版本的浏览器上是无法正常使用的，对于不支持的浏览器，我们默认会回退到提交数据到导出服务器，可以通过 [exporting.fallbackToExportServer](https://api.highcharts.com/highcharts/exporting.fallbackToExportServer) 来关闭行为，关于客户端导出在不同浏览器中的兼容详情请参考下方的表格。

IE 浏览器导出 PNG 格式图片或包含图片的图表时需要额外的 [canvg](https://github.com/canvg/canvg) 库；所有浏览器导出 PDF 文件都需要 [jsPDF](https://github.com/yWorks/jsPDF) 及 [svg2PDF](https://github.com/yWorks/svg2pdf.js) 库，默认情况下，这些文件会根据需求从我们的服务器上加载，可以通过 [exporting.libURL](https://api.highcharts.com/highcharts/exporting.libURL) 配置来指定加载这些文件的地址。如果页面中已经加载过这些文件，Highcharts 将不会再次加载。

PDF 不支持导出图像，会退回到导出服务器。

使用客户端导出很简单，只需要引入图表导出功能相关的文件即可，需要引入的文件如下所示：

```html
<script src="http://cdn.hcharts.cn/highcharts/highcharts.js"></script>
<script src="http://cdn.hcharts.cn/highcharts/modules/exporting.js"></script>
<script src="http://cdn.hcharts.cn/highcharts/modules/offline-exporting.js"></script>
```

[客户端导出官方 demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/exporting/offline-download-demo/)

## React

如果需要使用 React，需要使用模块导入，同时在使用之前对导出功能进行挂载。

```js
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HcExporting from 'highcharts/modules/exporting'
import OfflineExporting from 'highcharts/modules/offline-exporting'

HcExporting(Highcharts)
OfflineExporting(Highcharts)
```

::: tip

`highcharts-react-official` 提供了对 React 的支持，可以使用 `ref` 获取生成的 `chart` 示例。

`HcExporting(Highcharts)` 和 `OfflineExporting(Highcharts)` 会分别将 `exportChart()` 和 `exportChartLocal()` 两个方法挂载到实例对象中。

:::

如果使用 `HighCharts` 自带的操作按钮进行导出，那么不需要手动调用导出方法。

如果需要自定义导出按钮，则需要使用 `exportChartLocal()` 方法。

```jsx
<ChartOperationBar
  chart="{chartState}"
  leftInfoChildren="{props.leftInfoChildren}"
  rightInfoChildren="{props.rightInfoChildren}"
  exportChartTitle="{props.exportChartTitle}"
/>
<HighchartsReact ref={chartRef} highcharts={Highcharts} options={options}
callback={(chart: Chart) => setChartState(chart)} />
```

上面这个代码使用 `callback` 在 `highcharts` 实例化后将实例设置为 `state`，保证自定义操作组件能够获取到实例对象，在该组件中使用 `exportChartLocal()` 方法即可实现客户端导出。

::: warning

1. 如果简单地传递 `chartRef.current.chart`，子组件不会重新渲染导致获取到 `chart` 实例为 `undefined`。
2. 必须使用 `exportChartLocal()` 方法，若使用 `exportChart()` 方法仍然会使用服务器导出。

:::
