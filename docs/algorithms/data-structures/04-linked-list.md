---
title: 链表
date: 2022-08-02
category:
  - LeetCode
tag:
  - 链表
---

## [反转链表](https://leetcode.cn/problems/reverse-linked-list/)

```ts
function reverseList(head: ListNode | null): ListNode | null {
  let pre = null, cur = head

  while (cur) {
    const temp = cur.next
    cur.next = pre
    pre = cur
    cur = temp
  }

  return pre
};
```

## [反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)

```ts
function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummyNode = new ListNode(-1, head)

  let pre = dummyNode
  for (let i = 0; i < left - 1; i++) {
    pre = pre.next
  }

  let rightNode = pre
  for (let i = 0; i < right - left + 1; i++) {
    rightNode = rightNode.next
  }

  const leftNode = pre.next
  let last = rightNode.next

  pre.next = null;
  rightNode.next = null;
  reverse(leftNode)

  pre.next = rightNode
  leftNode.next = last

  return dummyNode.next
};

function reverse(head: ListNode) {
  let pre = null, cur = head

  while (cur) {
    const next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }
}
```