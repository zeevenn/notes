---
title: SEO
date: 2024-03-24
icon: seo
category:
  - HTML
tag:
  - seo
---

## 什么是 SEO

SEO（Search Engine Optimization，搜索引擎优化）。这是一套指导原则，旨在使网站在搜索结果中的排名高于其他网站。特别是针对有机（未付费）搜索结果。

::: tip

谷歌是迄今为止全球最主要的搜索引擎。作为行业领导者，谷歌为其他搜索引擎定下了基调。

:::

## 过去

在 2000 年代，搜索引擎优化意味着通过一系列肮脏的手段来提高网站在谷歌上的排名。

例如，人们在网页底部放置大量关键词列表。有时，他们还会将关键词重复 1000 次，并将其放在白色区域或隐形 `div` 内。谷歌被欺骗了，从而提高了他们的排名。

这种时代已经一去不复返了。谷歌聘请了世界上最优秀的人才，确保用户只能搜索到最有用的网页。

上述漏洞以及更多漏洞在 [谷歌质量指南](https://support.google.com/webmasters/topic/6001971) 中都有详细说明。

如果您的产品出于某种原因包含任何违反这些指南的内容，即使它们是不小心出现的，我也强烈建议将其删除，因为谷歌现在会对违反指南的网站进行惩罚。

## 搜索引擎优化

谷歌的排名算法非常复杂。谷歌的专家多年来一直在研究这些算法。如今，谷歌每天都会进行更新，更大的更新每年发布一到两次。

有关 Google 如何对网页进行排名的信息一直在发布，有时还会有额外的信息泄露。一些网站试图跟踪这些更新，了解更新对搜索引擎优化的影响。

对于开发人员来说，许多工具都可以抓取网站，并生成一份可以改进的网站技术方面的清单。例如，如果你没有使用正确的标题或状态代码。以下是其中几种工具：

- [checkbot](https://www.checkbot.io/)
- [SEO Site Checkup](https://seositecheckup.com/)
- [woorank](https://www.woorank.com/)
- [SEO Tester Online](https://suite.seotesteronline.com/)
- [seobility](https://freetools.seobility.net/)
- [screamingfrog](https://www.screamingfrog.co.uk/seo-spider/)
- [GTmetrix](https://gtmetrix.com/)

## 最佳实践

作为开发人员，应该考虑：快速，可访问性，使用正确的语义 `html` 标签，包括正确的结构化数据，移动友好，使用 `https`， `url` 清晰，等等。

[谷歌 SEO 指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?visit_id=638468790764088645-267844796&rd=1&hl=zh-cn) 有详细介绍，下面是一些较为重要的最佳实践。

- `<title>` 和 `<meta name="description">` 是控制网页在 Google 结果页面上显示方式的标签。
- HTML 标签（如标题标签 `h1`、`h2`）和 HTML 属性（如 `<img>` 标签上的 `alt` 属性）可帮助创建网页结构，以便爬虫更好地解读内容。
- 结构化数据将网页中的信息，如排名、位置、营业时间和价格等，显示在谷歌搜索页面上。搜索页面上出现的信息越多，网页被点击的几率就越高。
- 使网站对移动设备友好。
- 使用 HTTPS 协议。
- 让残疾人也能访问您的网站。这样不仅能让更多人访问你的网站，谷歌也会给你更高的排名。
- 使用合理且有意义的网站分层。`example.com/RunningShoes/Womens`而不是 `example.com/123123/123123`
- 注意你的 `<a href>` 链接
  - 每个链接都必须包含有意义的文本。
  - 使用 `<a>` 标签上的额外属性告诉谷歌你的外部网站链接的性质。例如，`rel="nofollow"` 用于让谷歌知道你与链接的网站没有关联。
  - 确保您希望谷歌抓取的每个页面都通过 `<a href>` 从主页链接（可能通过多个链接）。
- 确保不同版本之间的内容不重复，以免相互竞争：
  - 如果您对网站进行了结构调整，请使用 301 重定向，这样两个版本就不会被分别收录，也不会相互竞争。
  - 坚持使用一个版本的网站链接：
  - 使用 `<meta rel="canonical">` 标签来表示不同的页面和 URL 包含相同的内容。
- 本地化——使用 `hreflang meta` 标签告诉谷歌一个网页在不同语言中有不同的版本。
- 提高网站速度，在 [Google PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect) 上获得高分。

::: tip

网站响应速度会影响搜索引擎排名，这一部分涉及到性能优化。

:::
