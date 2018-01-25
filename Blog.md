react的发布让前端摆脱了使用jQuery一点一点修改DOM的历史。对于后来的很多框架都产生非常重要的影响。其中最为重要的概念就是Virtual DOM了，在后面vue也借鉴了这一概念，不过这两个框架对Virtual DOM的实现是不一样的。

作为一个搬砖的，肯定是离不开markdwon的，markdwon能够用很简洁的语法表现出很好的排版样式。所以也就关注了一些markdwon的解析器。在GitHub上找了几个比较流行的markdwon解析的库之后选择了[marked](https://github.com/chjj/marked)来研究，选择marked的原因主要是从代码量和支持语法两个方面考虑的，由于自己单枪匹马的干，所以选用的库不能太大了（我怕搞不定），marked的源码只有1000多行，而且代码结构还是比较清晰的，整个扒下来也就定义了三个类，分别是Lexer（块级语法解析）、InlineLexer（行内语法解析）和Renderer（渲染成html字符串），这里就不过多说明marked了，其中我借鉴了Lexer和InlineLexer两个类的实现。

![talk is cheap show me the code](http://upload-images.jianshu.io/upload_images/6492782-f6e1801eecc16df7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 嗯，好了，下面开始正式安利

### 源码目录结构

```bash
src
│ index.js # 入口文件 Parser类
│ utils.js # 工具代码
│
├─lexer # markdown解析相关代码 把字符串解析为vnode
│   block-lexer.js # 块级语法解析 BlockLexer类
│   block-rules.js # 块级语法解析规则
│   index.js # Lexer类
│   inline-lexer.js # 行内语法解析 InlineLexer类
│   inline-rules.js # 行内语法解析规则
│
├─renderer # 渲染类 把vnode diff并渲染到真实dom中
│   index.js # Renderer类
│
└─vnode # vnode定义代码
    index.js # 传入节点信息返回vnode
    vnode.js # Vnode类
```

### Markdwon解析流程介绍

![解析流程](http://upload-images.jianshu.io/upload_images/6492782-2451d1218d335070.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
