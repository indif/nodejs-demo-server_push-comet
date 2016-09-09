# nodejs-demo-server_push-comet
基于长连接的服务器推送示例
* * *

示例参考[《JavaScript权威指南》第18.3节](http://shop.oreilly.com/product/9780596805531.do)。

服务端基于Node.js实现。

客户端使用EventSource实现长连接的事件监听，并提供一个EventSource的polyfill。

关于服务器推送技术，参考[Mozilla的技术文档](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)。