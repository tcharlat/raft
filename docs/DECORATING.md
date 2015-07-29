# Raft Decorators  

Raft allows you to create your own [decorators](https://en.wikipedia.org/wiki/Decorator_pattern).

You can use the template [raftDecoratorTemplate.js](../raftDecoratorTemplate.js) and start creating your own custom class methods, instance methods, and collection methods right away !

How to decorate my factory with my custom decorator ?

Before you require/define/include your models :

```javascript
raft.decorate([raftLocal, raftNetwork, myCustomDecorator]);
```
Available decorators:

We designed two decorators as a boilerplate for a standard project :

[raftLocal](https://github.com/Kallikrein/raft-decorator-localStorage)
```
bower install --save raft-decorator-localStorage
```

[raftNetwork](https://github.com/Kallikrein/raft-decorator-network)
```
bower install --save raft-decorator-network
```
