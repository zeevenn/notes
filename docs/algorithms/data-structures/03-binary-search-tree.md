---
title: 二叉搜索树
date: 2022-06-24
category:
  - LeetCode
tag:
  - 二叉搜索树
---

## 特性

二叉搜索树(BST)特性：

1. 对于 BST 的每一个节点 node，左子树的节点都要比当前 node 小，右子树的节点都比当前 node 大；
2. 所有左子树和右子树也都是二叉搜索树；
3. 二叉搜索树的中序遍历为一个升序的数组。

### [二叉搜索树中第 k 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

由于二叉搜索树的中序遍历是升序数组，所以找第 k 小的元素可以先生成一个中序遍历的数组，再返回数组中的第 k 个值。也可以直接在中序遍历中直接记录第 k 小的值，然后返回。

这里用第二种方法，利用外部变量保存第 k 大的值。

```ts
function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0, res = 0;

  const inorder = function(root: TreeNode | null): number {
    if (root == null) {
      return;
    }

    inorder(root.left);
    
    // 记录第 k 大的值
    count += 1;
    if (count == k) {
      res = root.val;
      return;
    }

    inorder(root.right);
  };
  
  inorder(root);
  
  return res;
};
```

### [验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

这里也是利用二叉搜索树的中序遍历是升序排列，也可以先由中序遍历生成一个数组判断是否为升序；也可以直接在中序遍历中判断。这里要注意**左子树和右子树也需要是二叉搜索树**，因此需要分解问题。

```ts
function isValidBST(root: TreeNode | null): boolean {
  // 外部遍历记录之前节点
  let pre: TreeNode = null;

  const inorder = function(root: TreeNode): boolean {
    if (root == null) return true;

    // 左子树是否为二叉搜索树
    const left = inorder(root.left);

    // 比较当前节点与之前节点
    if (pre != null && root.val <= pre.val) return false;
    pre = root;

    // 右子树是否为二叉搜索树
    const right = inorder(root.right);

    return left && right;
  };
  
  return inorder(root);
};
```

### [恢复二叉搜索树](https://leetcode.cn/problems/recover-binary-search-tree/)

如果没要求 `O(1)` 复杂度，可以直接求出中序遍历的数组，再交换值就行。要求 `O(1)` 复杂度后，可以记录错误点，然后交换值。

```ts
function recoverTree(root: TreeNode | null): void {
  let pre = new TreeNode(-Infinity), n1: TreeNode = null, n2: TreeNode = null;

  const inorder = function(root: TreeNode | null): void {
    if (root == null) return;

    inorder(root.left);

    // 不满足二叉搜索树条件
    if (pre.val > root.val) {
      if (n1 == null) { // 第一个错误点
        n1 = pre;
      }
      // 第二个错误点
      n2 = root;
    }
    pre = root;

    inorder(root.right);
  };

  inorder(root);

  let temp = n1.val;
  n1.val = n2.val;
  n2.val = temp;
};
```

### [二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)

利用二叉树特性，判断最近公共祖先。

```ts
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
	if (root == null) return null
  // 保证 p <= q
  if (p.val > q.val) {
    return lowestCommonAncestor(root, q, p)
  }
  // root 在二者中间，那么 LCA 为 root
  if (root.val >= p.val && root.val <= q.val) {
    return root
  }
  // root 比二者都大，那么 LCA 在左子树
  if (root.val > q.val) {
    return lowestCommonAncestor(root.left, p, q)
  }
  // root 比二者都小，那么 LCA 在右子树
  if (root.val < p.val) {
    return lowestCommonAncestor(root.right, p, q)
  }
};
```

### [二叉搜索树中的众数](https://leetcode.cn/problems/find-mode-in-binary-search-tree/)

中序遍历中用 map 记录每个节点的数量，然后遍历 map 找到最大出现次数，再次遍历输出对应的值。

```ts
function findMode(root: TreeNode | null): number[] {
  if (root == null) return []
  let count = 0, pre = root.val, map = new Map()

  const inorder = function(root: TreeNode) {
    if (root == null) return

    inorder(root.left)

    if (root.val == pre) {
      count++
      map.set(root.val, count)
    } else {
      count = 1
      map.set(root.val, count)
    }

    pre = root.val
    
    inorder(root.right)
  }

  inorder(root)

  let res: number[] = [], max = 0
  for (const value of map.values()) {
    max = Math.max(value, max)
  }

  for (const key of map.keys()) {
    if (map.get(key) == max) {
      res.push(key)
    }
  }

  return res
};
```

### [删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)

明确函数定义：返回一个删除了节点的树。利用二叉搜索树特性，在 `key == root.val` 中处理节点。分为三种情况：

1. 左为空，返回右子树
2. 右为空，返回左子树
3. 左右都不为空，需要找到左子树中的最大节点替换根节点

```ts
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
  if (root == null) return null
  
  if (key > root.val) {
    root.right = deleteNode(root.right, key)
  } else if (key < root.val) {
    root.left = deleteNode(root.left, key)
  } else {
    // 左右为空的情况
    if (root.left == null) return root.right
    if (root.right == null) return root.left

    // 左右都不为空，需要找到左子树中的最大节点替换根节点

    // 1. 获取左子树最大的节点
    let p = root.left
    while (p.right != null) {
      p = p.right
    }
    // 2. 删除左子树上的最大节点
    root.left = deleteNode(root.left, p.val)
    // 3. 将 root 的左右子树接到 max 上
    p.left = root.left
    p.right = root.right
    // 4. root 重新赋值
    root = p
  }

  return root
};
```

### [二叉搜索树的最小绝对差](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/)

中序遍历计算绝对差。

```ts
function getMinimumDifference(root: TreeNode | null): number {
  let res = Infinity, pre = null

  const inorder = function(root: TreeNode | null) {
    if (root == null) return

    inorder(root.left)
    let sub = Infinity
    if (pre) sub = Math.abs(root.val - pre.val)
    res = Math.min(sub, res)
    pre = root

    inorder(root.right)
  }

  inorder(root)

  return res
};
```

## CRUD

## 构造

二叉树构造一般步骤为：

1. 找到所有根节点；
2. 递归找到所有左子树和右子树；
3. 将根节点与所有左子树和右子树的组合结合起来。

### [不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)

本题需要计算不同二叉树的个数，也就是左右子树个数的乘积。

```ts
function numTrees(n: number): number {
  // 备忘录：消除重叠子问题
  const memo: number[][] = new Array(n + 1).fill(0).map(() => new Array(n + 1).fill(0));

  // count(lo, hi): 闭区间 [lo, hi] 之间能组成多少种 BST
  const count = function(lo: number, hi: number): number {
    if (lo > hi) return 1;

    // 查备忘录
    if (memo[lo][hi] != 0) {
      return memo[lo][hi];
    }

    let res: number = 0;

    for (let i = lo; i <= hi; i++) {
      // 递归计算左右子树的个数
      const left = count(lo, i - 1);
      const right = count(i + 1, hi);
      res += left * right;
    }

    // 更新备忘录
    memo[lo][hi] = res;

    return res;
  }

  return count(1, n);
};
```

### [不同的二叉搜索树 II](https://leetcode.cn/problems/unique-binary-search-trees-ii/)

当能计算不同二叉搜索树的个数时，类似地也能构造出所有不同的二叉搜索树。

```ts
function generateTrees(n: number): Array<TreeNode | null> {
  // build(lo, hi): 闭区间 [lo, hi] 之间组成的 BST
  const build = function(lo: number, hi: number): Array<TreeNode | null> {
    const path: Array<TreeNode | null> = [];

    // 不符合条件时
    if (lo > hi) {
      path.push(null);
      return path;
    }

    // 1、穷举所有可能的根节点
    for (let i = lo; i <= hi; i++) {
      // 2、递归找到所有左子树和右子树
      const leftTree = build(lo, i - 1);
      const rightTree = build(i + 1, hi);
      // 3、将根节点与所有左子树和右子树的组合结合起来
      for (const left of leftTree) {
        for (const right of rightTree) {
          path.push(new TreeNode(i, left, right));
        }
      }
    }

    return path;
  }

  return build(1, n);
};
```

### [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

找到根节点，然后递归构造左右子树即可。

```
function sortedArrayToBST(nums: number[]): TreeNode | null {
  const traversal = function(nums: number[], lo: number, hi: number): TreeNode {
    if (lo > hi) return null

    const mid = Math.floor((hi + lo) / 2)
    const val = nums[mid]
    const left = traversal(nums, lo, mid - 1)
    const right = traversal(nums, mid + 1, hi)

    return new TreeNode(val, left, right)
  }

  return traversal(nums, 0, nums.length - 1)
};
```

### [有序链表转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/)

关键就是找到链表的中点。

```ts
function sortedListToBST(head: ListNode | null): TreeNode | null {
  // 区间为左闭右开：[head, end)
  const build = function(head: ListNode, end: ListNode): TreeNode {
    if (head == end) return null
    const mid = getMid(head, end)

    const left = build(head, mid)
    const right = build(mid.next, end)

    return new TreeNode(mid.val, left, right)
  }

  // 利用快慢指针找到链表中点
  const getMid = function(head: ListNode, end: ListNode) {
    let slow = head, fast = head
    while (fast !== end && fast.next !== end) {
      slow = slow.next
      fast = fast.next.next
    }
    return slow
  }

  return build(head, null)
};
```