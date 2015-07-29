# Raft Methods
```javascript

```
Raft provides a built-in set of methods :

- [id](#id)
- [version](#version)
- [toJSON](#toJSON)
- [update](#update)
- [expose](#expose)
- [pluck](#pluck)

Collections instance expose :

- [set](#set)
- [findOne](#findOne)
- [update](#update-1)
- [add](#add)
- [toJSON](#toJSON-1)
- [pluck](#pluck)

##Default instance methods

###id
```javascript
Class.prototype.id = (Class.prototype.id != null)
	? Class.prototype.id
	: (model.id == null)
		? function () {return (model.prefix);}
		: Class.prototype[model.id];
```
It's a getter setter to the variable defined with the config field 'id'.
If an attribute named 'id' exists, it is the id by default.

###version
```javascript
Class.prototype.version = (Class.prototype.version != null)
	? Class.prototype.version
	: (model.version == null)
		? function () {return ('0');}
		: Class.prototype[model.version];
```

###toJSON
```javascript
Class.prototype.toJSON = function () {
	var _obj = {};
	/*  ATTRIBUTES  */
	for(var name in model.attributes) {
		_obj[name] = this[name]();
	}/*! ATTRIBUTES !*/
	/*  COLLECTIONS  */
	for (var collection in model.collections) {
		_obj[collection] = this[collection].toJSON();
	}/*!  COLLECTIONS !*/
	/*  OBJECTS  */
	for (var object in model.objects) {
		_obj[object] = (model.objects[object].saveAsJson == true)
			? this[object].toJSON()
			: this[object].id();
	}/*! OBJECTS !*/
	return JSON.stringify(_obj);
};
```

###update
```javascript
Class.prototype.update = function (obj) {
	/*  ATTRIBUTES  */
	for(var name in model.attributes) {
		if (obj[name])
			this[name](obj[name]);
	}/*! ATTRIBUTES !*/
	/*  COLLECTIONS  */
	for (var collection in model.collections) {
		if (obj[collection])
			this[collection].set(obj[collection]);
	}/*! COLLECTIONS !*/
	/*  OBJECTS  */
	for (var object in model.objects) {

	}/*! OBJECTS !*/
};
```
This function takes an object litteral.
We might use, like for 'save', an optional option object to describe recursivity, reset/refresh behaviour for collection, etc.

NB :
- 'set' is a hard resetting update, update is not yet fully defined.  
**expect this behaviour to change !**

- behaviour for objects in not yet defined

###expose
```javascript
Class.prototype.expose = function (request) {
	var _obj = {};
	for (var field in request) {
		_obj[request[field]] = this[request[field]].bind(this);
	}
	return _obj;
};
```
This function take a string array.
This function returns an object populated with getter-setters for your attributes. 'this' is bound to these function

Example :
```javascript
var expose = foo.expose(['foo', 'bar']);
foo.foo(42);
expose.foo();						// 42
expose.bar(43);
foo.bar();							// 43
```
This is useful to generate view models and expose getter-setters to front-end logic without carrying the object around your app.
###pluck
```javascript
Class.prototype.pluck = function (request) {
	var _obj = {};
	for (var field in request)
		_obj[request[field]] = this[request[field]]();
	return _obj;
};
```
This function take a string array.
This function returns an object populated with the current value your attributes.

##Default collection methods

###set
```javascript
Collection.prototype.set = function (array) {
	var self = this;
	this._objects = array.map(function (item) {
		return new self._constructor(item);
	})
};
```
'set' takes an array litteral and deletes the old array. Should be rethought heavily.
###findOne
```javascript

```
Not implemented yet.

###update
```javascript
Collection.prototype.update = function(array) {
	for (var i in this._objects)
		this._objects[i].update(array[i]);
};
```
Iteratively 'update' every object in the array.  
**This function is currently broken !**  
'update' takes an array litteral that should be colinear to the collection array. Should be rethought heavily :
- should it search for items in the collection for each item in the array?
- should it update the items in the array and ignore the rest ? Delete the rest ?
- etc...  

###add
```javascript
Collection.prototype.add = function(obj) {
	if (obj instanceof Class)
		return this._objects.push(obj);
	else
		return this._objects.push(new this._constructor(obj));
};
```
'add' take and object litteral or an instance and simply adds it to the collection.
- Though this behaviour can allow for a broader semantic coverage, it SHOULD BE monomorphic for performance.
- If the obj is in the collection, should it update it ? reset it ?  
**expect this behaviour to change !**

###toJSON
```javascript
Collection.prototype.toJSON = function () {
	var _id = this._constructor.model.id || 'id';
	return this._objects.map(function (item) {
		var _ret = {};
		_ret[_id] = item.id();
		return _ret;
	});
};
```
Returns an array litteral populated with 'id' only objects.

###pluck
```javascript
Collection.prototype.pluck = function (values) {
	return this._objects.map(function (item) {
		return item.pluck(values);
	});
};
```
Iteratively 'pluck' every object in the array and returns an array of object litteral.