---
title: 享元模式
date: 2024-09-18
icon: flyweight
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - flyweight-pattern
---

## 享元模式

当我们创建大量对象时，我们可以使用享元模式来减少内存使用。

在我们的应用程序中，我们希望用户能够添加书籍。所有书籍都有 `title`、`author` 和 `isbn`！然而，一个图书馆通常不会只有一本书：它通常有同一本书的多本副本。

如果有多本完全相同的书，每次创建一个新的图书实例并不是很有用。相反，我们希望创建多个 `Book` 构造函数实例，代表一本书。

```js
class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}
```

如果一本书有相同的 ISBN 编号，因此是完全相同的图书类型，我们就不想创建一个全新的图书实例。相反，我们应该首先检查这本书是否已经存在。

```js
const books = new Map()

const createBook = (title, author, isbn) => {
  const existingBook = books.has(isbn)

  if (existingBook) {
    return books.get(isbn)
  }
}
```

如果它尚未包含图书的 ISBN 编号，我们将创建一本新书，并将其 ISBN 编号添加到 `isbnNumbers` 集合中。

```js
const createBook = (title, author, isbn) => {
  const existingBook = books.has(isbn)

  if (existingBook) {
    return books.get(isbn)
  }

  const book = new Book(title, author, isbn)
  books.set(isbn, book)

  return book
}
```

`createBook` 函数可以帮助我们创建一种图书的新实例。然而，图书馆通常包含同一本书的多个副本！让我们创建一个 `addBook` 函数，它允许我们添加同一本书的多个副本。它应该调用 `createBook` 函数，该函数要么返回一个新创建的图书实例，要么返回已经存在的实例。

为了记录副本总数，我们创建一个 `bookList` 数组，其中包含图书馆中的图书总数。

```js
const bookList = []

const addBook = (title, author, isbn, availability, sales) => {
  const book = {
    ...createBook(title, author, isbn),
    sales,
    availability,
    isbn
  }

  bookList.push(book)
  return book
}
```

完美！我们不必每次添加副本时都创建一个新的图书实例，而是可以有效地为特定副本使用已有的图书实例。让我们创建 3 本书的 5 个副本：《哈利-波特》、《杀死一只知更鸟》和《了不起的盖茨比》。

```js
addBook('Harry Potter', 'JK Rowling', 'AB123', false, 100)
addBook('Harry Potter', 'JK Rowling', 'AB123', true, 50)
addBook('To Kill a Mockingbird', 'Harper Lee', 'CD345', true, 10)
addBook('To Kill a Mockingbird', 'Harper Lee', 'CD345', false, 20)
addBook('The Great Gatsby', 'F. Scott Fitzgerald', 'EF567', false, 20)
```

## 特点

享元模式是一种结构型设计模式，其核心思想是通过共享已经存在的对象来减少内存占用，从而提高性能。有两个特点：

- 对象共享：避免重复创建相同状态的对象，节省内存。
- 不可变部分与可变部分分离：将对象分为共享的、不可变的部分（如 `title`、`author` 和 `isbn`）和非共享的、可变的部分（如 `availability` 和 `sales`）。

上述代码体现了这两个特点：

`Book` 类实例化了书籍的基本信息（`title`、`author`、`isbn`），并通过 `Map` 存储，确保同样的 `isbn` 只会创建一次。这部分相当于享元对象的内部状态（不可变且可以被多个实例共享）。

`addBook` 函数添加了一些书籍的可变信息（`sales` 和 `availability`），这些信息属于享元对象的外部状态（每次使用时可以独立指定）。

## 优点

- 减少内存占用：避免了为每个新书籍对象重复创建相同的 `Book` 实例。如果书籍的 `isbn` 相同，那么不再创建新的实例，而是共享现有的对象。
- 提高性能：通过共享已有对象，减少对象的创建和销毁，特别是在大量数据处理的场景中能显著提高性能。
- 更好的管理：将不可变的数据与可变数据分开，代码逻辑更加清晰，易于维护。

## 适用场景

在本例中，由于 `title`、`author` 和 `isbn` 都是基本数据类型（字符串），享元模式带来的优化可能会非常有限，甚至没有明显的优势，原因如下：

- 内存优化有限：由于字符串本身是不可变且通常由引擎优化处理，JavaScript 已经会对相同的字符串进行共享存储（类似于享元模式），这意味着手动实现的享元模式在这方面并没有太大的额外好处。
- 重复实例减少不明显：与对象不同，基本类型的重复实例在内存中通常不会像对象那样占用大量空间。因此，避免创建多个基本类型的实例不会有明显的内存节省。

因此，享元模式适用于有大量公共内在属性的场景，如：粒子系统，在这种情况下，每个粒子都有一些共同的属性，如颜色、精灵图等。通过享元模式，我们可以共享这些属性，从而节省内存。

::: warning

实际上享元模式是共享一些内在的公共状态，而不是共享所有的状态。

在 JavaScript 中，我们可以通过原型继承轻松解决这个问题。

在享元模式中，虽然最后创建的对象数量和之前一样多，但会大量节省内存。在本例中可能没有体现出这个好处，但是如果共享的内在状态是对象，那么享元模式就可以发挥作用。

:::
