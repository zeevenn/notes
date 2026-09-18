---
title: TurboModules 与 Codegen
date: 2026-09-18
category:
  - 前端
  - React Native
tag:
  - React Native
---

# TurboModules 与 Codegen

TurboModules 是新架构的原生模块系统，用于把存储、设备、算法等原生能力暴露给 JS。Codegen 根据接口规范生成两侧之间的衔接代码，让模块声明和原生实现遵循一致的契约。

## 声明一个原生能力

假设应用要读取设备上的轻量设置，创建 `specs/NativeSettings.ts`：

```ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getLabel(): string | null;
  setLabel(value: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSettings');
```

`Spec` 描述 JS 可见方法与类型。`getEnforcing` 在模块缺失时抛错，适合必须随应用提供的能力；可选能力可以用 `get` 并处理 `null`。

这份声明尚不能读取任何原生数据，还需要生成接口、实现平台方法、注册模块并重新构建。

## Codegen 在构建时做什么

在 `package.json` 中加入配置片段：

```json
{
  "codegenConfig": {
    "name": "NativeSettingsSpec",
    "type": "modules",
    "jsSrcsDir": "specs",
    "android": { "javaPackageName": "com.example.settings" }
  }
}
```

构建时，Codegen 读取支持的 TypeScript / Flow 规范，生成对应平台接口、类型转换和调用衔接代码。Android 可通过 React Native Gradle 插件运行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema
```

iOS 的生成流程与 CocoaPods / 原生构建配置集成。随后实现生成的接口并按平台完成注册；生成物不应作为业务逻辑的手工编辑入口。

Codegen 不执行任意 TypeScript 类型程序，只支持其规范允许的类型。它也不会替开发者完成存储、权限、线程调度和错误处理。

## 与旧 NativeModules 的区别

| 方面 | 传统原生模块路径 | TurboModules |
| --- | --- | --- |
| JS 接口 | 常通过 `NativeModules` 访问导出方法 | 规范描述接口，注册表获取模块 |
| 交互基础 | 主要通过旧 Bridge 调用消息 | 基于 JSI 的新模块绑定 |
| 加载 | 历史初始化流程常带来启动负担，具体实现有差异 | 支持按需获取与延迟初始化 |
| 契约 | 两侧声明容易脱节 | Codegen 生成两侧接口 |
| 返回方式 | 常用回调和 Promise，也存在同步例外 | 支持规范允许的同步或异步接口 |

延迟加载把一部分成本移到第一次访问。若应用启动时立即获取所有模块，仍可能集中支付初始化成本。

## 设计同步与异步方法

上面的同步 getter 只适合成本可控的读取。大文件、数据库查询、网络或复杂计算应设计明确的异步执行与取消策略。类型一致也不代表输入符合业务规则，原生侧仍需验证值和资源状态。

Codegen 也用于 Fabric 原生组件的属性和事件接口；TurboModules 暴露能力，Fabric 原生组件参与界面，两者按职责区分。

## 参考资料

- [Turbo Native Modules](https://reactnative.dev/docs/turbo-native-modules-introduction)
- [Using Codegen](https://reactnative.dev/docs/the-new-architecture/using-codegen)
- [新模块系统](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
