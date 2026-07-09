---
title: 数组
date: 2024-02-15
icon: array
category:
  - algorithm
tag:
  - 数组
  - 二分查找
  - 双指针
---

`JavaScript` 中数组是一种特殊的对象，用于存储多个值。数组的每个元素都有一个数字索引，用于访问数组中的元素。

常见初始化数组的方式：

```ts
const arr = [1, 2, 3]
const arr = new Array(1, 2, 3)
const arr = new Array(n).fill(0)
```

数组是一种线性表数据结构，它用一组连续的内存空间，来存储一组具有相同类型的数据。

常见的解题思路有：

- 二分查找
- 双指针
- 滑动窗口
- 暴力解法

## n 数之和

一般思路为使用哈希表、双指针、排序等方法。

### 两数之和

::: tip 原题链接

[1. 两数之和](https://leetcode-cn.com/problems/two-sum)

:::

思路：使用哈希表存储遍历过的元素，每次遍历时，判断哈希表中是否存在 `target - nums[i]`，如果存在则返回结果。

```ts
function twoSum(nums: number[], target: number): number[] {
  const map = new Map()

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i]

    if (map.has(diff)) {
      return [map.get(diff), i]
    }

    map.set(nums[i], i)
  }

  return []
}
```

### 三数之和

::: tip 原题链接

[15. 三数之和](https://leetcode-cn.com/problems/3sum)

:::

#### 思路

这个题能否使用两数之和的解法？应该可以。

首先需要注意一点，这里需要返回不重复的结果，因此无论是使用三重循环暴力解法还是使用外层循环 + 两数之和，首先应该排序，否则将很难过滤掉重复结果。

::: tip

试想一下，由于需要过滤掉重复结果，那么外层循环必须要跳过之前重复的元素，若不先进行排序，那么需要一个额外的结构如 `set` 存储已经循环的数据。

:::

#### 解法

##### 两数之和

首先尝试使用两数之和去解，发现第一个 `case` 会少一个结果，`[-1,0,1,2,-1,-4]` 只会返回 `[[-1,0,1]]` ，简单分析一下：

- 首先排序 `[-4, -1, -1, 0, 1, 2, 4]`
- 第一轮 `-4` 可以忽略，因为后续没有答案
- 第二轮 `-1` 时，开始传入 `twoSum([-1, 0, 1, 2, 4], 1)` ，这里会直接返回 `[0, 1]` ，在这里明显漏掉了 `[-1, 2]` 这个答案，原因在于这个函数找到结果后会直接返回

```ts
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b)
  const result: number[][] = []

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue
    }

    const target = -nums[i]
    const res = twoSum(nums.slice(i + 1), target)
    if (res === -1) continue
    result.push([nums[i], ...res])
  }

  return result
}

function twoSum(nums: number[], target: number) {
  const map = new Map()

  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) {
      return [target - nums[i], nums[i]]
    } else {
      map.set(nums[i], i)
    }
  }

  return -1
}
```

找到问题所在后，需要对 `twoSum` 函数进行改造。但是又出现一个问题，怎么对 `twoSum` 返回的结果进行去重？

这里借助一个 `set` 结构，能确保返回的数对不重复。

```ts
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b)
  const result: number[][] = []

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue
    }

    const target = -nums[i]
    const res = twoSum(nums.slice(i + 1), target)

    // 这里返回的结果为多个，因此也需要更改一下逻辑
    res.forEach((arr) => {
      result.push([nums[i], ...arr])
    })
  }

  return result
}

function twoSum(nums: number[], target: number) {
  const map = new Map()
  const resultSet = new Set<string>()
  const result: number[][] = []

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (map.has(complement)) {
      const pair = [complement, nums[i]].sort((a, b) => a - b) // 确保数对顺序一致
      const pairKey = pair.join(',')

      if (!resultSet.has(pairKey)) {
        resultSet.add(pairKey) // 记录这个数对，避免重复
        result.push(pair) // 添加到结果数组中
      }
    }

    map.set(nums[i], i)
  }

  return result
}
```

然而该方法效率过低：

![效率低](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240919114159.png)

##### 双指针

刚才的算法时间复杂度为 `O(n^2)` ，但是由于调用了 `slice` 并且在内部又进行了一系列的去重操作，因此耗时较多。

在前面的分析中，由于排序是我们第一步的必要操作（为了方便去重），因此有了下面的思考：

- 排序后，问题简化为寻找两数之和
- 而对于排序数组，使用双指针线性扫描更为高效

双指针的前提在于有序数组（这里我们已经从小到大排序），让双指针从数组两端逐渐向中间靠拢。每当计算出三数之和时：

- 如果和太小（小于目标值），我们可以增加左指针的值，因为增加左指针意味着增加总和。
- 如果和太大（大于目标值），我们可以减少右指针的值，因为减少右指针意味着减小总和。

因此，最终**步骤**：

1. 先对数组排序。
2. 固定一个数，然后使用双指针分别指向剩余部分的开头和结尾，寻找符合条件的另外两个数。
3. 如果找到三数之和为 0，则添加到结果中，并跳过重复的数字以避免重复解。

```ts
function threeSum(nums: number[]): number[][] {
	nums.sort((a, b) => a - b); // 先排序
	const result: number[][] = [];
	
	for (let i = 0; i < nums.length; i++) {
		if (i > 0 && nums[i] === nums[i - 1]) continue; // 跳过重复的数字
		
		let left = i + 1;
		let right = nums.length - 1;
		
		while (left < right) {
			const sum = nums[i] + nums[left] + nums[right];
			
			if (sum === 0) {
				result.push([nums[i], nums[left], nums[right]]);
				
				// 跳过重复的左侧元素
				while (left < right && nums[left] === nums[left + 1]) {
					left++;
				}
				
				// 跳过重复的右侧元素
				while (right > left && nums[right] === nums[right - 1]) {
					right--;
				}
				
				left++;
				right--;
			} else if (sum > 0) {
				right--;
			} else {
				left++;
			}
		}
	}
}
```

#### 总结

双指针法的核心思路是通过排序让数组变得有序，再通过指针逐步调整找到符合条件的数对。

它不仅能优化算法复杂度，还能通过简单的跳过重复元素的逻辑来避免冗余计算。

在考虑解决「三数之和」这类问题时，双指针法自然而然成为优化的关键，因为它能在保持可读性和逻辑清晰的同时，大幅提高效率。

解法对比：

- 原始解法使用 `twoSum` 子函数来查找符合条件的两数之和，但每次都需要生成新数组并调用线性查找，这引入了不必要的开销。
- 双指针法通过直接操作排序后的数组，避免了子数组的生成，并在一次遍历中完成两数查找，显著提高了时间效率。

::: tip

思考一个问题，两数之和是不是也能使用双指针来完成？

答案是肯定的，但是这样时间复杂度会上升到 `O(nlogn)`，因为排序的时间复杂度是 `O(nlogn)`，双指针的时间复杂度是 `O(n)`，所以总的时间复杂度是 `O(nlogn)`。

:::

### 最接近的三数之和

::: tip 原题链接

[16. 最接近的三数之和](https://leetcode-cn.com/problems/3sum-closest)

:::

#### 暴力解法

思路：使用三重循环，遍历数组，计算三数之和，然后比较与目标值的差值，找到最接近的结果。

```ts
function threeSumClosest(nums: number[], target: number): number {
  let res = nums[0] + nums[1] + nums[2]

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k]

        if (Math.abs(sum - target) < Math.abs(res - target)) {
          res = sum
        }
      }
    }
  }

  return res
}
```

#### 双指针

思路：使用双指针，先对数组进行排序，然后遍历数组，使用双指针分别指向当前元素的下一个元素和数组的最后一个元素，计算三数之和，然后移动指针。

```ts
function threeSumClosest(nums: number[], target: number): number {
  let res = nums[0] + nums[1] + nums[2]

  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length; i++) {
    let left = i + 1
    let right = nums.length - 1

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]

      if (Math.abs(sum - target) < Math.abs(res - target)) {
        res = sum
      }

      if (sum > target) {
        right--
      } else if (sum < target) {
        left++
      } else {
        return res
      }
    }
  }

  return res
}
```

### 四数之和

::: tip 原题链接

[18. 四数之和](https://leetcode-cn.com/problems/4sum)

:::

思路：参照 [三数之和](#三数之和)，使用双指针，先对数组进行排序，然后遍历数组，使用双指针分别指向当前元素的下一个元素和数组的最后一个元素，计算四数之和，然后移动指针。

::: warning 易错提示

- 在遍历数组时，需要判断是否和前一个元素相等，如果相等则跳过。
- `i` 从 0 开始，`j` 从 `i + 1` 开始，`left` 从 `j + 1` 开始，`right` 从 `nums.length - 1` 开始。

:::

```ts
function fourSum(nums: number[], target: number): number[][] {
  const res = []
  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue

    for (let j = i + 1; j < nums.length; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue

      let left = j + 1,
        right = nums.length - 1

      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right]

        if (sum > target) {
          right--
        } else if (sum < target) {
          left++
        } else {
          res.push([nums[i], nums[j], nums[left], nums[right]])

          while (left < right && nums[left] === nums[left + 1]) left++
          while (left < right && nums[right] === nums[right - 1]) right--

          left++
          right--
        }
      }
    }
  }

  return res
}
```

## 双指针

### 接雨水

::: tip 原题链接

[11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water)

[42. 接雨水](https://leetcode-cn.com/problems/trapping-rain-water)

:::

思路：使用双指针，分别指向数组的头尾，计算当前面积，然后移动高度较小的指针。

```ts
function maxArea(height: number[]): number {
  let res = 0
  let left = 0,
    right = height.length - 1

  while (left <= right) {
    const weight = right - left

    if (height[left] < height[right]) {
      res = Math.max(height[left] * weight, res)
      left++
    } else {
      res = Math.max(height[right] * weight, res)
      right--
    }
  }

  return res
}
```

### 删除有序数组中的重复项

::: tip 原题链接

[26. 删除有序数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array)

:::

思路：使用双指针，一个指针用于遍历数组，另一个指针用于指向不重复的元素。

```ts
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0

  let slow = 0

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[slow] !== nums[fast]) {
      slow++
      nums[slow] = nums[fast]
    }
  }

  return slow + 1
}
```

### 移除元素

::: tip 原题链接

[27. 移除元素](https://leetcode-cn.com/problems/remove-element)

:::

思路：使用双指针，一个指针用于遍历数组，另一个指针用于指向不等于目标值的元素。

```ts
function removeElement(nums: number[], val: number): number {
  let slow = 0

  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow++] = nums[fast]
    }
  }

  return slow
}
```

### 下一个排列

::: tip 原题链接

[31. 下一个排列](https://leetcode.cn/problems/next-permutation/description/)

:::

思路：关键找到「较小数」与「较大数」。

1. 我们需要将一个左边的「较小数」与一个右边的「较大数」交换，以能够让当前排列变大，从而得到下一个排列。
2. 同时我们要让这个「较小数」尽量靠右，而「较大数」尽可能小。当交换完成后，「较大数」右边的数需要按照升序重新排列。这样可以在保证新排列大于原来排列的情况下，使变大的幅度尽可能小。

以排列 `[4,5,2,6,3,1]` 为例：

- 我们能找到的符合条件的一对「较小数」与「较大数」的组合为 `2` 与 `3`，满足「较小数」尽量靠右，而「较大数」尽可能小。
- 当我们完成交换后排列变为 `[4,5,3,6,2,1]`，此时我们可以重排「较小数」右边的序列，序列变为 `[4,5,3,1,2,6]`。

```ts
/**
 Do not return anything, modify nums in-place instead.
 */
function nextPermutation(nums: number[]): void {
  let i = nums.length - 2

  // find smaller num
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    i--
  }

  // now [i + 1, end) is decreasing

  // find bigger num
  if (i >= 0) {
    let j = nums.length - 1
    while (j > 0 && nums[i] >= nums[j]) {
      j--
    }
    // swap
    ;[nums[i], nums[j]] = [nums[j], nums[i]]
  }

  // reverse [i, end)
  for (let l = i + 1, r = nums.length - 1; l < r; l++, r--) {
    ;[nums[l], nums[r]] = [nums[r], nums[l]]
  }
}
```
