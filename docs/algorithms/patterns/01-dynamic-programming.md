---
title: 动态规划
date: 2022-08-01
category:
  - LeetCode
tag:
  - 动态规划
---

动态规划的一般形式是**求最值**，核心问题就是**穷举**。将所有可行的子问题答案穷举出来（二叉树的分解问题形式），然后在其中寻找最值。

动态规划需要判断问题是否具备**最优子问题**，还需要写出正确的**状态转移方程**，另外，由于动态规划存在**重叠子问题**，需要优化穷举过程（备忘录或 `dp` 数组），否则会超时。

## 基础

动态规划问题其实都可以使用**暴力递归**求解，如何消除重叠子问题就可以分成**备忘录或 `dp` 数组**优化。

### [斐波那契数](https://leetcode.cn/problems/fibonacci-number/)

暴力递归。

```ts
function fib(n: number): number {
  if (n == 0 || n == 1) return n

  return fib(n - 1) + fib(n - 2)
};
```

使用备忘录，实际上是一个**自顶向下**的过程。

```ts
function fib(n: number): number {
  const memo = new Array(n + 1).fill(0)

  const helper = function(n: number): number {
    if (n == 0 || n == 1) return n
    if (memo[n] != 0) return memo[n]
    memo[n] = helper(n - 1) + helper(n - 2)
    return memo[n]
  }

  return helper(n)
};
```

使用 `dp` 数组，实际上是一个**自底向上**的过程。

```ts
function fib(n: number): number {
  if (n == 0) return 0
  const dp: number[] = new Array(n + 1).fill(0)
  dp[0] = 0, dp[1] = 1 
  
  for (let i = 2; i < n + 1; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }

  return dp[n]
};
```

### [零钱兑换](https://leetcode.cn/problems/coin-change/)

暴力递归。

```ts
function coinChange(coins: number[], amount: number): number {
  const dp = function(n: number): number {
    if (n == 0) return 0
    if (n < 0) return -1;

    let res = Infinity
    for (const coin of coins) {
      const sub = dp(n - coin)
      if (sub == -1) continue
      res = Math.min(res, 1 + sub)
    }
    return res == Infinity ? -1 : res
  }

  return dp(amount)
};
```

备忘录。

```ts
function coinChange(coins: number[], amount: number): number {
  const memo: number[] = new Array(amount + 1).fill(-100)

  const dp = function(n: number): number {
    if (n == 0) return 0
    if (n < 0) return -1;
    if (memo[n] != -100) return memo[n]

    let res = Infinity
    for (const coin of coins) {
      const sub = dp(n - coin)
      if (sub == -1) continue
      res = Math.min(res, 1 + sub)
    }
    memo[n] = (res == Infinity) ? -1 : res
    return memo[n]
  }

  return dp(amount)
};
```

`dp` 数组：当目标金额为 `i` 时，至少需要 `dp[i]` 枚硬币凑出。

```ts
function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(amount + 1)
  dp[0] = 0

  for (let i = 0; i < dp.length; i++) {
    for (const coin of coins) {
      if (i - coin < 0) continue
      dp[i] = Math.min(dp[i], 1 + dp[i - coin])
    }
  }

  return dp[amount] == amount + 1 ? -1 : dp[amount]
};
```

### [爬楼梯](https://leetcode.cn/problems/climbing-stairs/submissions/)

3 阶楼梯可以由 1 阶和 2 阶楼梯的方法数推出来，因此是一个典型的动态规划问题。

```ts
function climbStairs(n: number): number {
  // 定义：dp[i] 为爬上 i 阶楼梯方法数
  const dp: number[] = new Array(n + 1).fill(0)
  dp[0] = 0, dp[1] = 1, dp[2] = 2

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2] 
  }

  return dp[n]
};
```

### [使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)

可以选择从 0 或 1 的台阶开始爬，因此到达 0 阶和 1 阶楼梯的最低花费为 0。

```ts
function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length
  // 定义：dp[i] 为到达 i 阶楼梯的最低花费，dp[n] 即为所求
  const dp: number[] = new Array(n + 1)
  dp[0] = 0, dp[1] = 0

  for (let i = 2; i <= n; i++) {
    // 到达 i-1 或 i-2 楼梯时，还需花费 cost[i-1] 和 cost[i-2] 才能到 i 阶楼梯
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
  }

  return dp[n]
};
```

### [不同路径](https://leetcode.cn/problems/unique-paths/)

dp 数组。

```ts
function uniquePaths(m: number, n: number): number {
  // 定义：dp[i][j] 为 到 i 和 j 的不同路径数
  const dp: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0))

  for (let i = 0; i < m; i++) {
    dp[i][0] = 1
  }

  for (let j = 0; j < n; j++) {
    dp[0][j] = 1
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    }
  }

  return dp[m - 1][n - 1]
};
```

### [不同路径Ⅱ](https://leetcode.cn/problems/unique-paths-ii/submissions/)

初始化状态时当遇到障碍，则后面的都不可能到达，应该赋值为 0。

```ts
function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length, n = obstacleGrid[0].length
  // dp[i][j] 为 到达 i-1, j-1 的不同路径
  const dp: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0))

  for (let i = 0; i < m && obstacleGrid[i][0] == 0; i++) {
    dp[i][0] = 1
  }

  for (let j = 0; j < n && obstacleGrid[0][j] == 0; j++) {
    dp[0][j] = 1
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] == 1) {
        dp[i][j] = 0
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
      }
    }
  }

  return dp[m - 1][n - 1]
};
```

### [整数拆分](https://leetcode.cn/problems/integer-break/)

```ts
function integerBreak(n: number): number {
  const dp: number[] = new Array(n + 1).fill(0)
  dp[2] = 1

  for (let i = 3; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      dp[i] = Math.max(dp[i], dp[i - j] * j, (i - j) * j)
    }
  }

  return dp[n]
};
```

## 子序列问题

子序列和最值考察的基本都是动态规划。

### [最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

`dp` 数组定义为：以第 `i` 个数结尾的最长递增子序列长度为 `dp[i]`。

```ts
function lengthOfLIS(nums: number[]): number {
  const dp: number[] = new Array(nums.length).fill(1)

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }

  let res = 0
  for (let i = 0; i < dp.length; i++) {
    res = Math.max(res, dp[i])
  }

  return res
};
```

### [最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

#### 动态规划

定义好 `dp` 数组后，`dp[i]` 要么自成一个子数组，要么和 `dp[i - 1]` 形成一个子数组，判断二者最大值即为状态转移方程。

```ts
function maxSubArray(nums: number[]): number {
  // dp[i]: 第 i 个数结尾的最大连续子数组和
  const dp: number[] = new Array(nums.length)
  // base case
  dp[0] = nums[0]

  // 状态转移方程
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(nums[i], nums[i] + dp[i - 1])
  }
  
  // 比较最大和
  let res = -Infinity
  for (let i = 0; i < dp.length; i++) {
    res = Math.max(res, dp[i])
  }

  return res
};
```

#### 滑动窗口

滑动窗口就是专门处理子串/子数组问题的方法，关键找到窗口收缩的条件，本题收缩的条件就是和小于 0 时，因为这无论如何都满足不了最大和。

```ts
function maxSubArray(nums: number[]): number {
  let res = -Infinity, sum = 0
  let left = 0, right = 0

  while(right < nums.length) {
    // 移入
    const n1 = nums[right]
    // 增大窗口
    right++
    // 更新窗口
    sum += n1
    res = Math.max(res, sum)

    // 当和为负数时，肯定不可能满足条件，需要收缩窗口
    while(sum < 0) {
      // 移除
      const n2 = nums[left]
       // 缩小窗口
       left++
       // 更新窗口
       sum -= n2
    }
  }

  return res
};
```

### [最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

算法题不能从整体看问题，应该考虑每个点需要做什么，再应用迭代或者递归解决问题。这个题应该看每个字符是什么情况。

暴力递归，会超时。

```ts
function longestCommonSubsequence(text1: string, text2: string): number {
  // 定义：计算 s1[i..] 和 s2[j..] 的最长公共子序列长度
  const dp = function(s1: string, i: number, s2: string, j: number): number {
    // base case
    if (i == s1.length || j == s2.length) return 0
    if (s1[i] == s2[j]) {
      // 相等则必然在 LCS 中
      return 1 + dp(s1, i + 1, s2, j + 1)
    } else {
      return Math.max(
        // 1. s1[i] 不在 LCS 中
        dp(s1, i + 1, s2, j),
        // 2. s2[j] 不在 LCS 中
        dp(s1, i, s2, j + 1),
        // 3. s1[i] 和 s2[j] 都不在 LCS 中
        dp(s1, i + 1, s2, j + 1)
      )
    }
  }

  return dp(text1, 0, text2, 0)
};
```

备忘录。

```ts
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length
  const memo: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(-1))

  // 定义：计算 s1[i..] 和 s2[j..] 的最长公共子序列长度
  const dp = function(s1: string, i: number, s2: string, j: number): number {
    // base case
    if (i == s1.length || j == s2.length) return 0
    if (memo[i][j] != -1) return memo[i][j]

    if (s1[i] == s2[j]) {
      // 相等则必然在 LCS 中
      memo[i][j] = 1 + dp(s1, i + 1, s2, j + 1)
    } else {
      memo[i][j] = Math.max(
        // 1. s1[i] 不在 LCS 中
        dp(s1, i + 1, s2, j),
        // 2. s2[j] 不在 LCS 中
        dp(s1, i, s2, j + 1),
        // 3. s1[i] 和 s2[j] 都不在 LCS 中
        dp(s1, i + 1, s2, j + 1)
      )
    }

    return memo[i][j]
  }

  return dp(text1, 0, text2, 0)
};
```

`dp` 数组：注意索引位置。

```ts
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length
  // 定义：dp[i][j] 为 s1[0 .. i - 1] 和 s2[0 .. j - 1] 的最长公共子序列长度
  // 目标：dp[m][n]
  // base case: dp[i][0] = 0, dp[0][j] = 0
  const dp: number[][] = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] == text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j])
      }
    }
  }

  return dp[m][n]
};
```

### [两个字符串的删除操作](https://leetcode.cn/problems/delete-operation-for-two-strings/submissions/)

计算出最长公共子序列即可算出最小需要删除次数。

```ts
function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length
  
  const LCS = function(s1: string, s2: string): number {
    const m = s1.length, n = s2.length
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] == s2[j - 1]) {
          dp[i][j] = 1 + dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }
    
    return dp[m][n]
  }

  return m + n - 2 * LCS(word1, word2)
};
```

### [两个字符串的最小ASCII删除和](https://leetcode.cn/problems/minimum-ascii-delete-sum-for-two-strings/)

和上两题类似，但是需要改变 base case。

```ts
function minimumDeleteSum(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  const dp: number[][] = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  
  // 当 s2 为空，那么 s1 需要全部删除
  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
  }

  // 当 s1 为空，那么 s2 需要全部删除
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);
  }

  for (let i = 1; i <= m; i++) {
    const code1 = s1.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const code2 = s2.charCodeAt(j - 1);
      if (code1 === code2) {
        // 两个字符串相等，不需要删除
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // 不等，取最小值
        dp[i][j] = Math.min(dp[i - 1][j] + code1, dp[i][j - 1] + code2);
      }
    }
  }
  
  return dp[m][n];
};
```

### [编辑距离](https://leetcode.cn/problems/edit-distance/)

对 A 进行增，实际上相当于对 B 进行删除，那么对单词 A 的增、删、改三个操作：可以理解为：

1. B 删除一个单词（增）
2. A 删除一个单词（删）
3. A 替换一个单词（改）

```ts
function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length
  // 定义：dp[i][j] 表示 word1[0..i-1] 和 word2[0..j-1] 最小编辑距离
  const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    dp[i][0] = i
  }

  for (let j = 1; j <= n; j++) {
    dp[0][j] = j
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] == word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          // 在 B 中删除
          dp[i][j - 1] + 1,
          // 在 A 中删除
          dp[i - 1][j] + 1,
          // 改
          dp[i - 1][j - 1] + 1
        )
      }
    }
  }

  return dp[m][n]
};
```

### [最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/)

```ts
function longestPalindromeSubseq(s: string): number {
  const n = s.length
  // 定义：dp[i][j] 为 s[i..j]内的最长回文子序列长度
  const dp: number[][] =  new Array(n).fill(0).map(() => new Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    dp[i][i] = 1
  }

  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (s[i] == s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1])
      }
    }
  }

  return dp[0][n - 1]
};
```

### [让字符串成为回文串的最少插入次数](https://leetcode.cn/problems/minimum-insertion-steps-to-make-a-string-palindrome/)

```ts
function minInsertions(s: string): number {
  const n = s.length
  // 定义：dp[i][j] 为 s[i-1..j-1] 成文回文串的最少插入次数
  const dp: number[][] = new Array(n).fill(0).map(() => new Array(n).fill(0))
  // base case
  for (let i = 0; i < n; i++) {
    dp[i][i] = 0
  }

  // 反着遍历保证正确的状态转移
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (s[i] == s[j]) {
        // 相等，不需要插入
        dp[i][j] = dp[i + 1][j - 1]
      } else {
        // 不相等，比较 s[i+1..j] 和 s[i..j-1] 插入次数大小
        // 然后还需插入一个使 s[i..j] 为回文串
        dp[i][j] = Math.min(dp[i + 1][j], dp[i][j - 1]) + 1
      }
    }
  }

  return dp[0][n - 1]
};
```

还可以用字符串长度减最长回文子序列。

```ts
function minInsertions(s: string): number {
  return s.length - longestPalindromeSubseq(s)
};
```

## 01 背包

### [分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)

可以讲问题转换为对于集合 `nums`，是否能满足 `sum/2` 的背包容量。

定义 `dp[i][j]`: 对于前 `i` 个数是否能装满背包容量 `j`。

```ts
function canPartition(nums: number[]): boolean {
  const n = nums.length
  const sum = nums.reduce((pre, cur) => pre + cur)
  // 和为奇数不可能分成两个相等的集合
  if (sum % 2 != 0) return false

  // dp[i][j]: 对于前 i 个数是否能装满背包容量 j
  const dp: boolean[][] = new Array(n + 1).fill(0).map(() => new Array(sum + 1).fill(false))
  
  // 对于容量为 0 的背包，已经装满了，即为 true
  for (let i = 0; i <= n; i++) {
    dp[i][0] = true
  }
  // 对于重量为 0 的物品，不可能装满，即为 false
  for (let j = 0; j <= sum; j++) {
    dp[0][j] = false
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= sum; j++) {
      if (j - nums[i - 1] < 0) {
        // 背包容量不足，不放入第 i 个物品
        dp[i][j] = dp[i - 1][j]
      } else {
        // 背包容量充足，选择放入或不放入背包
        dp[i][j] = dp[i - 1][j - nums[i - 1]] || dp[i - 1][j]
      }
    }
  }

  return dp[n][sum / 2]
};
```

还可以定义 `dp[i][j]`: 对于前 `i` 个数装进背包容量 `j` 的最大值。

```ts
function canPartition(nums: number[]): boolean {
  const n = nums.length
  const sum = nums.reduce((pre, cur) => pre + cur)
  // 和为奇数不可能分成两个相等的集合
  if (sum % 2 != 0) return false

  // dp[i][j]: 对于前 i 个数装进背包容量 j 的最大值
  const dp: number[][] = new Array(n + 1).fill(0).map(() => new Array(sum + 1).fill(0))
  
  // 对于容量为 0 的背包（没有空间），最大值为 0
  // dp[i][0] = 0

  // 对于前 0 个物品（没有物品），最大值当然也为 0
  // dp[0][j] = 0

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= sum; j++) {
      if (j - nums[i - 1] < 0) {
        // 背包容量不足，不放入第 i 个物品
        dp[i][j] = dp[i - 1][j]
      } else {
        // 背包容量充足，选择放入或不放入背包（择优）
        dp[i][j] = Math.max(dp[i - 1][j - nums[i - 1]] + nums[i - 1], dp[i - 1][j])
      }
    }
  }

  // 最大值为 sum / 2，能凑成
  if (dp[n][sum / 2] == sum / 2) return true
  return false
};
```

### [最后一块石头的重量 II](https://leetcode.cn/problems/last-stone-weight-ii/)

转换为 01 背包。

```ts
function lastStoneWeightII(stones: number[]): number {
  const n = stones.length
  const sum = stones.reduce((pre, cur) => pre + cur)
  // dp[i][j] 为前 i 个石头中在背包容量为 j 的最大容量
  const target = Math.floor(sum / 2)
  const dp: number[][] = new Array(n + 1).fill(0).map(() => new Array(target + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      if (j - stones[i - 1] < 0) {
        dp[i][j] = dp[i - 1][j]
      } else {
        dp[i][j] = Math.max(dp[i - 1][j - stones[i - 1]] + stones[i - 1], dp[i - 1][j])
      }
    }
  }

  return sum - 2 * dp[n][target]
};
```