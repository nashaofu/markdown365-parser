# 语法

## 标题

# header 1
header 1
======
## header 2
header 2
-----
### header 3
#### header 4
##### header 5
###### header 6

## 复选列表
- [x] checklist 1
- [x] checklist 2
- [x] checklist 3
- [x] checklist 4

## 表格

| name | gender | age | height | weight |
| :--- | :---: | ---: | :---: | :---: |
| **Jack** | male | 20 | 175 | 70 |
| **Rose** | female | 18 | 168 | 55 |

## 链接

* 行内式
  1. I get 10 times more traffic from [Google](http://google.com/) than from [Yahoo](http://search.yahoo.com/) or [MSN](http://search.msn.com/).

  2. I get 10 times more traffic from [Google](http://google.com/ "Google") than from [Yahoo](http://search.yahoo.com/ "Yahoo Search") or [MSN](http://search.msn.com/ "MSN Search").

  3. 相对路径链接[链接到图片](./static/markdown365.png)

* 参考式：
  1. I get 10 times more traffic from [Google] [1] than from [Yahoo] [2] or [MSN] [3].

  2. I get 10 times more traffic from [Google][] than from [Yahoo][] or [MSN][].

  [1]: https://google.com/        "Google"
  [2]: https://search.yahoo.com/  "Yahoo Search"
  [3]: https://search.msn.com/    "MSN Search"
  [google]: https://www.google.com/    "Google"
  [yahoo]:  https://search.yahoo.com/  "Yahoo Search"
  [msn]:    https://search.msn.com/    "MSN Search"


## 图片

* 行内式

![markdown365](./static/markdown365.png)

* 参考式

![markdown365][1].

[1]: https://markdown365.github.io/markdown365-parser/static/markdown365.png

## 无序列表

- li [-]
+ li [+]
* li [*]

## 有序列表

1. li 1
2. li 2
3. li 3

## 嵌套列表

1. ol list 1
  * ol list 1
  * ol list 2
2. checklist
  - [ ] checklist 1
  - [ ] checklist 2
  - [x] checklist 3
3. three layers
  1. ul list 1
    - ol list 1
    - [ ] checklist
    1. ul list 1
  2. ul list 2

## 引用块

> quote 1
>> quote 2
* ol list 1
* ol list 2
```js
console.log('code block in quote')
```

## 代码块

```js
const reduce = a => a !== undefined
  ? b => b !== undefined
    ? reduce(a + b)
    : a
  : a
const b = reduce(1)(2)(3)(4)()
```

## 粗体和斜体

I am **bold**

I am __bold__

I am *italic*

I am _italic_

I am ***bold and italic***

## 下划线

这是一个下划线
******

## 行内代码

我想要标记一下`console.log('Hello')`

代码中有反引号：``There is a literal backtick (`) here.``

## 自动链接

<http://example.com/>

<address@example.com>

## html

<h5>我是h5标签</h5>

<img src="./static/markdown365.png" width="120px" title="markdown365" />

