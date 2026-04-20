---
title: 二叉树
date: 2022-06-23
category:
  - LeetCode
tag:
  - 二叉树
---

通常二叉树有两种做法，分别对应着回溯算法和动态规划：

1. 一次遍历二叉树：用 `traverse` 函数配合外部变量，实质上是一个**回溯框架**；
2. 分解问题：通过分解为左右子树问题解决，实质上是**动态规划**。

## 一次遍历（回溯）

### [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

在前序位置（进入当前节点）中将当前深度 `+1`，并计算最大深度，再后序位置（离开当前节点）中将深度 `-1`。本质上就是一个回溯算法。

```ts
function maxDepth(root: TreeNode | null): number {
  let depth: number = 0
  let res: number = 0

  const traverse = function(root: TreeNode | null) {
    if (root == null) return;

    depth++
    if (root.left == null && root.right == null) {
      res = Math.max(res, depth)
    }
    traverse(root.left)
    traverse(root.right)
    depth--
  }

  traverse(root)

  return res
};
```

### [路径总和](https://leetcode.cn/problems/path-sum/)

回溯过程中判断到达根节点时和是否和目标和相等。

```ts
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (root == null) return false
  
  let sum = 0, res = false

  const traverse = function(root: TreeNode) {
    if (root == null) {
      return
    }

    sum += root.val
    if (root.left == null && root.right == null) {
      if (sum == targetSum) {
        res = true
      }
    }
          
    traverse(root.left)
    traverse(root.right)
    sum -= root.val
  }

  traverse(root)

  return res
};
```

### [路径总和Ⅱ](https://leetcode.cn/problems/path-sum-ii/submissions/)

和上一题一样，只不过多维护一个路径数组。

```ts
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  if (root == null) return []

  // 路径、最终结果及当前和
  const path: number[] = [], res: number[][] = []
  let curSum = 0

  const traverse = function(root: TreeNode) {
    if (root == null) return

    curSum += root.val
    path.push(root.val)
    // 到达叶子节点时判断是否满足条件
    if (root.left == null && root.right == null) {
      if (curSum == targetSum) {
        res.push([...path])
      }
    }

    traverse(root.left)
    traverse(root.right)

    // 回溯
    curSum -= root.val
    path.pop()
  }

  traverse(root)

  return res
};
```

### [求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)

记录所有路径即可求和。

```ts
function sumNumbers(root: TreeNode | null): number {
  if (root == null) return 0

  let path: string[] = [], res = 0

  const traverse = function(root: TreeNode) {
    if (root == null) return
    
    path.push(root.val + '')
    if (root.left == null && root.right == null) {
      res += Number(path.join(''))
    }
    traverse(root.left)
    traverse(root.right)
    path.pop()
  }

  traverse(root)

  return res
};
```

### [二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)

将上面的题改一些代码即可。

```ts
function binaryTreePaths(root: TreeNode | null): string[] {
  if (root == null) return []

  let path: number[] = [], res: string[] = []

  const traverse = function(root: TreeNode) {
    if (root == null) return
    
    path.push(root.val)
    if (root.left == null && root.right == null) {
      res.push(path.join('->'))
    }
    traverse(root.left)
    traverse(root.right)
    path.pop()
  }

  traverse(root)

  return res
};
```

### [左叶子之和](https://leetcode.cn/problems/sum-of-left-leaves/)

一次遍历找到左叶子即可。

```ts
function sumOfLeftLeaves(root: TreeNode | null): number {
  if (root == null) return 0

  let res = 0

  const traverse = function(root: TreeNode) {
    if (root == null) return 0

    if (root.left) {
      if (root.left.left == null && root.left.right == null) {
        res += root.left.val
      }
    }
    traverse(root.left)
    traverse(root.right)
  }

  traverse(root)

  return res
};
```

## 分解问题（动态规划）

### [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

这个题可以一次遍历解决问题，同样也能计算左右子树的最大深度，从而计算出整棵树的最大深度。这就是动态规划，而动态规划必须明确函数的意义，这个题的函数就是输入一个根节点，计算最大深度。

```ts
function maxDepth(root: TreeNode | null): number {
  if (root == null) return 0;

  const left = maxDepth(root.left)
  const right = maxDepth(root.right)

  // 左右子树的最大深度 + 根节点
  return Math.max(left, right) + 1
};
```

### [二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

```ts
function minDepth(root: TreeNode | null): number {
  if (root == null) return 0

  const left = minDepth(root.left)
  const right = minDepth(root.right)

  if (root.left == null && root.right != null) return 1 + right
  if (root.left != null && root.right == null) return 1 + left

  return 1 + Math.min(left, right)
};
```

### [平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

在计算二叉树深度的同时判断是否为平衡二叉树。

```ts
function isBalanced(root: TreeNode | null): boolean {
  if (root == null) return true

  let isBalanced = true

  const getDepth = function(root: TreeNode): number {
    if (root == null) return 0

    if (!isBalanced) return

    const left = getDepth(root.left)
    const right = getDepth(root.right)

    if (Math.abs(left - right) > 1) {
      isBalanced = false
    }

    return 1 + Math.max(left, right)
  }

  getDepth(root)

  return isBalanced
};
```

### [相同的树](https://leetcode.cn/problems/same-tree/)

将问题分解为左右子树是否相同。

```ts
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p == null && q == null) return true;
  if (p == null && q != null) return false;
  if (p != null && q == null) return false;
  if (p.val != q.val) return false;

  const left = isSameTree(p.left, q.left);
  const right = isSameTree(p.right, q.right);

  return left && right;
};
```

### [对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

判断左右子树是否对称即可。

```ts
function isSymmetric(root: TreeNode | null): boolean {
  if (root === null) return true

  const traverse = (n1: TreeNode, n2: TreeNode): boolean => {
    if (n1 == null) return n2 == null
    if (n2 == null) return false
    if (n1.val != n2.val) return false

    const left = traverse(n1.left, n2.right)
    const right = traverse(n1.right, n2.left)
    return left && right
  }

  return traverse(root.left, root.right)
};
```

### [二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

分解为左右子树问题即可。

```ts
function flatten(root: TreeNode | null): void {
  if (root == null) return

  const traverse = function(root: TreeNode): TreeNode {
    if (root == null) return null

    const left = traverse(root.left)
    const right = traverse(root.right)
  
    // 把左子树连接到右子树
    root.left = null
    root.right = left

    // 把右子树连到最末端
    let p: TreeNode = root
    while(p.right != null) {
      p = p.right
    }

    p.right = right
    
    return root
  }

  traverse(root)
};
```

### [翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

明确函数定义，左右子树反转即可。

```ts
function invertTree(root: TreeNode | null): TreeNode | null {
  if (root == null) return null

  const left = invertTree(root.left)
  const right = invertTree(root.right)

  return new TreeNode(root.val, right, left)
};
```

### [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/submissions/)

```ts
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
	if (root == null) return null
  if (root == p || root == q) return root

  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  
  // 左右都不为 null
  if (left != null && right != null) {
    return root
  }
  // 左右都为 null
  if (left == null && right == null) {
    return null
  }
  // 有一个不为 null
  return left == null ? right : left
};
```

### [出现次数最多的子树元素和](https://leetcode.cn/problems/most-frequent-subtree-sum/)

通过后序遍历记录子树和出现的次数，再计算最多次数即可。

```ts
function findFrequentTreeSum(root: TreeNode | null): number[] {
  const map = new Map()

  function sum(root: TreeNode | null) {
    if (root == null) return 0

    const left = sum(root.left)
    const right = sum(root.right)
    const res = root.val + left + right

    const count = map.get(res) ?? 0
    map.set(res, count + 1)

    return res
  }

  sum(root)

  let maxCount = 0
  for (const val of map.values()) {
    maxCount = Math.max(maxCount, val)
  }

  let res: number[] = []
  for (const key of map.keys()) {
    if (map.get(key) == maxCount) {
      res.push(key)
    }
  }

  return res
};
```

## 层序遍历

### [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

队列是核心数据结构。

```ts
function levelOrder(root: TreeNode | null): number[][] {
  if (root == null) return []

  const queue: (TreeNode | null)[] = []
  queue.push(root)
  const res: number[][] = []

  while(queue.length) {
    const len = queue.length
    const temp: number[] = []

    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      temp.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    res.push(temp)
  }

  return res
};
```

### [二叉树的锯齿层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)

用一个遍历记录层级，奇数则用 `unshift`，偶数则 `push`。

```ts
function zigzagLevelOrder(root: TreeNode | null): number[][] {
  if (root == null) return []

  const queue: TreeNode[] = []
  queue.push(root)
  let level: number = 0
  const res: number[][] = []

  while (queue.length) {
    const len = queue.length;
    const temp: number[] = []
    
    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      if (level % 2 == 0) {
        temp.push(node.val)
      } else {
        temp.unshift(node.val)
      }

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    level++
    res.push(temp)
  }

  return res
};
```

### [填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)

层序遍历，记录前一个节点即可。

```ts
function connect(root: Node | null): Node | null {
  if (root == null) return null

  const queue = []
  queue.push(root)

  while(queue.length) {
    const len = queue.length
    
    let pre = null
    for (let i = 0; i < len; i++) {
      // 记录第一个节点
      if (i == 0) {
        pre = queue[0]
      }

      const node = queue.shift()
      
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)

      // 将前一节点的 next 设为当前节点
      // 更新前一节点为当前节点
      if (i != 0) {
        pre.next = node
        pre = node
      }
    }
  }

  return root
};
```

### [二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

层序遍历，当 `i` 为最后一个则将值加入 `res`。

```ts
function rightSideView(root: TreeNode | null): number[] {
  if (root == null) return []
  const queue: TreeNode[] = [], res: number[] = []
  queue.push(root)

  while (queue.length) {
    const len = queue.length

    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      if (i == len - 1) res.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }
  
  return res
};
```

### [完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

层序遍历中记录节点个数。

```ts
function countNodes(root: TreeNode | null): number {
  if (root == null) return 0
  const queue: TreeNode[] = []
  let res = 0
  queue.push(root)

  while (queue.length) {
    const len = queue.length

    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      res++
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }
  
  return res
};
```

### [找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)

层序遍历记录第一个节点即可。

```ts
function findBottomLeftValue(root: TreeNode | null): number {
  const queue: TreeNode[] = []
  queue.push(root)
  let res = 0

  while(queue.length) {
    const len = queue.length

    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      if (i == 0) res = node.val

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }

  return res
};
```

## 构造

构造二叉树基本步骤：

1. 找到根节点
2. 递归遍历所有左右子树
3. 返回根节点

### [从前序与中序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

```ts
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const build = function(preorder: number[], preStart: number, preEnd: number,
                         inorder: number[], inStart: number, inEnd: number): TreeNode | null {
    if (preStart > preEnd) return null
    
    // 根节点的 val
    const val = preorder[preStart]
    // 根据中序遍历找到左右子树边界
    let index: number
    for (let i = inStart; i <= inEnd; i++) {
      if (inorder[i] == val) {
        index = i
        break
      }
    }
    // 左子树长度
    let leftSize = index - inStart

    // 构造左右子树，注意起始下标
    const left = build(preorder, preStart + 1, preStart + leftSize, inorder, inStart, index - 1)
    const right = build(preorder, preStart + leftSize + 1, preEnd, inorder, index + 1, inEnd)

    return new TreeNode(val, left, right)
  }

  return build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1)
};
```

### [从中序和后序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

```ts
function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  const build = function (inorder: number[], inStart: number, inEnd: number,
    postorder: number[], postStart: number, postEnd: number): TreeNode | null {
      if (inStart > inEnd) return null

      // 根节点的 val
      const val = postorder[postEnd]
      // 利用中序遍历找到左右子树边界
      let index: number
      for (let i = inStart; i <= inEnd; i++) {
        if (inorder[i] == val) {
          index = i
          break
        }
      }
      // 左子树长度
      let leftSize = index - inStart

      // 构造左右子树
      const left = build(inorder, inStart, index - 1, 
                         postorder, postStart, postStart + leftSize - 1)
      const right = build(inorder, index + 1, inEnd,
                          postorder, postStart + leftSize, postEnd - 1)

      return new TreeNode(val, left, right)
  }

  return build(inorder, 0, inorder.length - 1, postorder, 0, postorder.length - 1)
};
```

### [二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)

通常构造二叉树需要两个遍历结果，但是这里按照前序遍历序列化后，再按前序遍历反序列化也能构造出二叉树。在序列化时可以选择使用**一次遍历**，也可以使用**分解问题**。

```ts
function serialize(root: TreeNode | null): string {
  const res: string[] = []
  
  const traverse = function(root: TreeNode) {
    if (root == null) {
      res.push('#')
      return
    }

    res.push(root.val + '')
    traverse(root.left)
    traverse(root.right)
  }

  traverse(root) 
  return res.join(',')
};

function deserialize(data: string): TreeNode | null {
  // 反转之后可以使用 pop，减少复杂度
  const nodes = data.split(',').reverse()
  
  const build = function(nodes) {
    if (!nodes.length) return null

    const val = nodes.pop()
    if (val == '#') return null
    const left = build(nodes)
    const right = build(nodes)

    return new TreeNode(val, left, right)
  }

  return build(nodes)
};
```