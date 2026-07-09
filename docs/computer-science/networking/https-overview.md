---
title: HTTPS 略解
date: 2022-05-05
icon: STARTUP
category:
  - 计算机网络
tag:
  - HTTP
  - HTTPS
---

## HTTP 和 HTTPS

### 区别

- HTTP 是明文传输，不安全，而 HTTPS 加入了 SSL/TLS 安全协议，使得报文能加密传输；
- HTTP 建立连接只需 TCP 三次握手，而 HTTPS 在三次握手后，还需要进行 SSL/TLS 握手；
- HTTP 端口号为 80，HTTPS 端口号为 443；
- HTTPS 需要向 CA 申请数字证书。

![http](/assets/image/computer-science/networking/006/HTTP.png)

![https](/assets/image/computer-science/networking/006/HTTPS.png)

### HTTPS 缺点

- 在相同网络环境中，HTTPS 相比 HTTP 无论是响应时间还是耗电量都有大幅度上升；
- HTTPS 的安全是有范围的，在黑客攻击、服务器劫持等情况下几乎起不到作用；
- 在现有的证书机制下，中间人攻击依然有可能发生；
- HTTPS 需要更多的服务器资源，也会导致成本的升高。

## 加密算法

HTTPS 使用混合加密算法解决数据安全传输问题，即**对称加密**和**非对称加密**混合使用。

### 对称加密

加密和解密都是同一个密钥，优缺点如下：

**优点：**

1. 由于密钥相同，因此加密解密速度快，适合加密比较大的数据。

**缺点：**

1. 交易双方在传输过程中需要使用相同的密钥，因此需要在**首次**传输过程中必然需要由一方将密钥传给另一方，这样就无法保证保证密钥的安全性，有可能会被截获；
2. 不同用户访问的密钥需要不同，这会造成服务器管理密钥困难，成本高。

### 非对称加密

加密和解密使用不同的密钥：公钥（public key）加密和私钥（private key）解密。流程如下：

1. 发送方向接收方请求一个公钥；
2. 发送方使用公钥加密，公钥和加密的数据泄露并没有关系，因为只有私钥才能解密；
3. 接收方用私钥解密消息。

**优点：**

1. 加密和解密使用不同的密钥，私钥不需要通过网络传输，安全性高。

**缺点：**

1. 计算量比较大，加密解密速度比对称加密慢；
2. 中间人攻击：中间人进行拦截，无法保证公钥是接收方提供的。

![中间人攻击](/assets/image/computer-science/networking/006/mid-attack.png)

## 数字证书和数字签名

中间人攻击使我们无法验证公钥的真假。因此引入**数字证书**，用它来证明身份是真实的，并且防止被中间人攻击。

由数字证书认证机构（Certificate Authority，简称 CA）负责给用户签发数字证书，证书中包括：签发者、使用者公钥、使用的 HASH 算法、证书到期时间等。

但是问题来了，如果中间人篡改了证书，如何保证身份证明是有效的？这时需要引进**数字签名**。

首先使用 CA 自带的 HASH 算法对证书的内容进行 HASH 得到一个信息摘要，再用 CA 的私钥进行加密，最终组成数字签名。当服务器将原始信息和数字签名发送过来时，客户端先使用 CA 的公钥对数字签名进行解密，得到 CA 创建的信息摘要，再使用同样的 HASH 算法生成原始信息的信息摘要，两者进行对比，就知道证书是否被篡改了。

通过数字签名的证书验证，能最大程度的保证数据传输安全。

## HTTPS 工作流程

前面提到，HTTPS 使用了混合加密解决安全传输问题，整个工作过程分为三大步：证书验证、非对称加密和对称加密。

![https工作流程](/assets/image/computer-science/networking/006/https-flow.png)

**证书验证：**

1. Client 发起一个 HTTPS 的请求；
2. Server 把事先配置好的公钥证书返回给客户端；
3. Client 验证公钥证书：如果验证通过则继续，不通过则显示警告信息；

**非对称加密：**

4. Client 生成加密所使用的会话密钥，然后用证书的公钥加密这个会话密钥，发给 Server。
5. Server 使用自己的私钥解密这个消息，得到会话密钥。至此，Client 和 Server 双方都持有了相同的会话密钥。

**对称加密：**

6. Server 使用会话密钥加密“明文内容 A”，发送给 Client。
7. Client 使用会话密钥解密响应的密文，得到“明文内容 A”。
8. Client 再次发起 HTTPS 的请求，使用会话密钥加密请求的“明文内容 B”，然后 Server 使用会话密钥解密密文，得到“明文内容 B”。

## 参考链接

[\[信息安全\] 1.密码工具箱 ](https://www.cnblogs.com/linianhui/p/security-based-toolbox.html)

[\[信息安全\] 2.密码工具箱（续）](https://www.cnblogs.com/linianhui/p/security-complex-toolbox.html)

[\[信息安全\] 3.HTTPS 工作流程](https://www.cnblogs.com/linianhui/p/security-https-workflow.html)

[HTTPS 详解一：附带最精美详尽的 HTTPS 原理图](https://segmentfault.com/a/1190000021494676)
