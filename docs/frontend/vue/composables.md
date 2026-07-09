---
title: 组合式函数
date: 2022-06-09
category:
  - Vue
tag:
  - 组合式 API
---

虽然利用 `setup` 函数将 options API 收集到了一起，但这也使 `setup` 选项变得更加庞大，当逻辑多起来时，这种开发方式好像更为复杂，但是可以将一些代码提取到一个独立的**组合式函数**中。

## `useCounter`

在之前计数器的案例中，如果单纯使用 `setup` 函数，代码应该是这样：

```vue
<script>
import { ref } from 'vue';

export default {
  setup() {
    const counter = ref(0);

    const increment = () => counter.value++;
    const decrement = () => counter.value--;

    return {
      counter,
      increment,
      decrement
    }
  }
}
</script>
```

但是如果希望在多个组件中使用相同的逻辑，应该怎么办？可以将逻辑提取到一个单独的外部文件中，作为一个可组合函数：

**hooks/useCounter.js**

```js
import { ref } from "vue";

export default function() {
  const counter = ref(0);

  const increment = () => counter.value++;
  const decrement = () => counter.value--;

  return {
    counter,
    increment,
    decrement
  }
}
```

可以在组件中使用 `useCounter`：

```vue
<script>
import useCounter from "./hooks/useCounter.js";

export default {
  setup() {
    const { counter, increment, decrement } = useCounter();

    return {
      counter,
      increment,
      decrement
    }
  }
}
</script>
```

## `useMousePosition`

如果需要实现鼠标跟踪功能，可以这样实现：

```vue
<script>
import { ref } from "vue";

export default {
  setup() {
    const x = ref(0);
    const y = ref(0);

    window.addEventListener("mousemove", (event) => {
      x.value = event.pageX;
      y.value = event.pageY;
    })

    return {
      x,
      y
    }
  }
}
</script>
```

可以写成组合式函数：

**hooks/useMousePosition.js**

```js
import { ref } from "vue";

export default function() {
  const x = ref(0);
  const y = ref(0);

  window.addEventListener("mousemove", (event) => {
    x.value = event.pageX;
    y.value = event.pageY;
  })

  return {
    x,
    y
  }
}
```

同样可以这样使用：

```vue
<script>
import useMousePosition from "./hooks/useMousePosition.js";

export default {
  setup() {
    const { x, y } = useMousePosition();

    return {
      x,
      y
    }
  }
}
</script>
```

## 与 `mixin` 比较

mixin 主要有三个缺点：

1. 不清楚属性的来源：当使用许多 mixin 时，不清楚 property 是由哪个 mixin 注入的，使得跟踪实现和理解组件的行为变得困难。
2. 命名冲突：来自不同 mixin 可能注册相同的属性键，从而导致命名冲突。
3. 隐式依赖：mixin 与 mixin 之间的依赖是隐式的，当 A mixin 中的函数依赖 B mixin 中的函数时，这种关系不是通过显示的声明（import 语句或依赖注入）取得的，也不是通过公共约定（如全局上的方法）确定的，就会给代码造成困扰。

因此，Vue@3.x 中**不再推荐**使用 mixin。