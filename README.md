# nodejs-demo-server_push-comet
基于长连接的服务器推送示例
* * *

示例参考[《JavaScript权威指南》第18.3节](http://shop.oreilly.com/product/9780596805531.do)。

服务端基于Node.js实现。

客户端使用EventSource实现长连接的事件监听，并提供一个EventSource的[polyfill](https://github.com/indif/nodejs-demo-server_push-comet/blob/master/polyfill.js)。
其他实现还有[Remy Sharp's EventSource polyfill](https://github.com/remy/polyfills/blob/master/EventSource.js)、[Yaffle’s EventSource polyfill](https://github.com/Yaffle/EventSource)和[Rick Waldron’s jquery plugin](https://github.com/rwldrn/jquery.eventsource)。

[Mozilla关于服务器推送的技术文档](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)。

[HTML规范中关于Server-sent events的描述](https://html.spec.whatwg.org/multipage/comms.html#server-sent-events)。