---
title: 多态与类型转换
date: 2026-09-24
category: java
---

子类型多态允许调用方通过一个父类或接口类型使用不同实现。调用方依赖统一的操作，实际对象决定执行哪个被重写的实例方法。

```java
interface Formatter {
    String format(String text);
}

class PlainFormatter implements Formatter {
    @Override
    public String format(String text) {
        return text;
    }
}

class BracketFormatter implements Formatter {
    @Override
    public String format(String text) {
        return "[" + text + "]";
    }
}

class Printer {
    static void print(Formatter formatter, String text) {
        System.out.println(formatter.format(text));
    }
}
```

```java
Printer.print(new PlainFormatter(), "Java");   // Java
Printer.print(new BracketFormatter(), "Java"); // [Java]
```

`Printer` 不需要枚举所有实现类型。这里使用接口建立统一类型，同样的机制也适用于[类继承](./inheritance.md)。接口的声明规则见[抽象类与接口](./abstract-and-interface.md)。

## 声明类型与实际类型

```java
Formatter formatter = new BracketFormatter();
String result = formatter.format("Java");
```

变量的声明类型是 `Formatter`，对象的实际类型是 `BracketFormatter`。方法调用分两步理解：

1. 编译期根据接收者和参数的编译期类型检查成员是否可访问，并完成重载选择。
2. 对可动态分派的实例方法，运行期根据实际对象类型找到相应实现。

子类没有重写某个方法时，可以直接执行继承的实现。动态分派不要求每个子类都重新写一遍方法。

## 重载选择不会在运行期重做

```java
class Animal {
    public String sound() { return "animal"; }
}

class Dog extends Animal {
    @Override public String sound() { return "dog"; }
}

class Demo {
    static String choose(Animal value) { return "Animal overload"; }
    static String choose(Dog value) { return "Dog overload"; }

    public static void main(String[] args) {
        Animal value = new Dog();
        System.out.println(choose(value)); // Animal overload
        System.out.println(value.sound()); // dog
    }
}
```

`choose(value)` 的参数编译期类型是 `Animal`，所以选中对应重载；`sound()` 则沿实际对象类型查找重写实现。字段和静态方法不使用这一动态分派机制，见[重写、重载与隐藏](./inheritance.md#重写、重载与隐藏)。

## 向上转型

把子类型引用赋给父类或接口类型，是扩大引用的可用类型范围，通常可以隐式完成：

```java
Dog dog = new Dog();
Animal animal = dog;
System.out.println(animal == dog); // true
```

转型不会复制对象，也不会改变对象的实际类型。父类引用只能直接使用其编译期类型允许的成员，即使实际对象还提供额外方法。

## 向下转型与 instanceof

将较宽类型的引用转换为较具体的类型，需要编译期允许该转换，并在运行期检查对象是否兼容。

```java
Animal animal = new Dog();
Dog dog = (Dog) animal;

Animal other = new Animal();
// Dog invalid = (Dog) other; // ClassCastException
```

`instanceof` 检查对象是否属于目标类型或其子类型。对 `null` 的检查结果是 `false`；引用强制转换 `null` 的结果仍是 `null`。

```java
if (animal instanceof Dog dogValue) {
    System.out.println(dogValue.sound());
}
```

这是 Java 17 可用的类型模式，将类型检查与局部变量声明合并。变量作用域及后续版本扩展见[模式匹配](./pattern-matching.md)。

## 多态与按类型分支

当不同对象各自拥有一种行为，可以把行为放入统一接口或父类方法，让调用方直接调用。若每次新增实现都要修改一长串 `instanceof`，应检查是否遗漏了这个行为抽象。

对于结构稳定的数据模型，例如受控的语法树，也可以集中按类型处理。两种组织方式的取舍取决于类型和操作分别如何变化，见[密封类与密封接口](./sealed-types.md)与[模式匹配](./pattern-matching.md)。

## 参考资料

- [Java SE 17 JLS：Method Invocation Expressions](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html#jls-15.12)
- [Java SE 17 JLS：Narrowing Reference Conversion](https://docs.oracle.com/javase/specs/jls/se17/html/jls-5.html#jls-5.1.6)
- [Dev.java：Polymorphism](https://dev.java/learn/inheritance/polymorphism/)
