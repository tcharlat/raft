# Raft Models
```javascript
var model = {
	attributes: {},
	collections: {},
	methods: {},
	//statics: {},
	id: '',
	version: '',
	prefix: ''
}

```
- [Introduction](#Introduction)
- [Attributes](#Attributes)
- [Collections](#Collections)
- [Methods](#Methods)
- [Config](#Config)

###Introduction
#### A simple raft model :
```javascript
var fooModel = {
	attributes: {
		foo: {
			default: 'bar'
		}
	}
};

```
#### Constructor :
raft generates a constructor for the class that your model is defining :
```javascript
var Foo = raft(fooModel);

```
The constructor can take zero arguments or an object litteral :
```javascript
var foobar = new Foo();
var foobur = new Foo({foo: 'bur'});
```
All attributes defined in the model will :
- if they are set in the object litteral, they will be set at this value
- if not, they will be either to the dault value if defined in the model, or 'undefined'

### Attributes
An attribute 'foo' will have a value '_foo' in the object and should not be accessed this way.
Raft exposes a getter-setter method 'foo()' instead.  
You can optionally define 'is' method to your attributes to expose syntactic-friendly logic to the rest of your application.
#### Getter-Setter
```javascript
var foobar = new Foo();
foobar.foo();							//'bar' (default)
foobar.foo('bir');						//'bir'

var foobur = new Foo({foo: 'bur'});
foobur.foo();							//'bur'
```
#### 'is' Methods
- 'is' methods are attached to attributes
- they allways receive the getter-setter as a bound argument
- they return true or false
- the are wrapped in a promise

a simple fooValid 'is' method :
```javascript
function fooValid(value) {
	if (value() == 'bar')
		return false;
	return true;
}
```
You can attach this method to an attribute :
```javascript
fooModel.attributes.foo.is = {
	Valid: fooValid
};
```

Now objects expose a 'fooIsValid' method :
```javascript
foobar.foo('bar');
foobar.fooIsValid()
.then((function (value) {
	console.log(value());
})
.catch(console.log.bind(console));		// undefined/foo: 'bar' is not Valid

foobar.foo('bir');
foobar.fooIsValid()
.then((function (value) {
	console.log(value());				// 'bir'
})
.catch(console.log.bind(console));
```

Discussion:

- is it a good thing to return a promise ?
- what should be the 'resolve' value ? The getter setter or the attribute value itself ?
- should the 'fooIsValid()' method better be of the form 'foo.is.Valid()' ?

#### 'is' global
If several attributes should be tested simultaneously, you can use a global 'is' method.  

```javascript
function barValid(value) {
	if (value() == 'foo')
		return false;
	return true;
}
fooModel.attributes.bar = {
	default: 'foo',
	is: {Valid: barValid}
};
var Foo = factory(fooModel);
var foobar = new Foo({
	foo: 'bar',
	bar: 'foo'
});										//default : { foo: 'bar', bar: 'foo' }

foobar.isValid()
.then(function (array) {
	array.map(function (item){
		console.log(item());
	});
})
.catch(console.log.bind(console));		//undefined/foo: 'bar' is not Valid

foobar.foo('bir');
foobar.bar('fio');

foobar.isValid()
.then(function (array) {
	array.map(function (item){
		console.log(item());			//'bir', 'fio'
	});
})
.catch(console.log.bind(console));

```
This feature can be useful if you need to group a set of function under a same semantic accessor.  
A simple example could be a form validation:
Even if each attribute has its own validation, like a password's length should be more than 8 characters, a username can't contain forbidden characters and an email adress should match a regex.

If these attributes are all defined with a 'is' AValidForm method, you can check the form validity with form.isAValidForm().

Discussion:
- as for the attribute 'is' method, the global 'is' could be clearer and simpler.

### Collections
Your object can contain collections.
A collection contains an array of typed objects, the model to create these objects and the model definition.
It exposes an api of methods.

Creating a collection:

Let's create a new class 'Toto'. This class has a collection of 'Foo'
```javascript
var totoModel = {
	attributes: {
		toto: {
			default: 'tata'
		}
	},
	collections: {
		fooCollection: {
			type: Foo					// this constructor must be already built with raft
		}
	}
};

```

### Methods
raft provides an api of methods, as detailed [here](./METHODS.md).
You can (and should) define your own model-specific instance methods and class methods.

#### Instance methods

Instance methods, though defined in the model definition, will have access to 'this'.

```javascript
fooModel.methods = {
	foobar: function () {
		this._myVar = "I can access 'this' but should never modify my class definition for js optimization";
		console.log(this.foo());
		console.log(this.bar());
	}
};

foobar = new factory(fooModel)();		//foobar._myVar undefined

foobar.foobar();						//'bar' 'foo', foobar._myVar "I can access 'this'..."
```
#### Class methods

Class methods are currently disabled in the current version, will be back soon...

```javascript
fooModel.statics = {
	staticBar : function () {}
}
```
TODO:
warning if a reserved keyword is used
### Config

####Id

The 'id' field allows you to alias another attribute to be the unique identifier of an object.
It's implemented as a ressource for decorators and for collection management.

```javascript
fooModel.id = 'bar';
foobar = new factory(fooModel)({bar: 42});
foobar.id();							//42
foobar.id(43);							//43
foobar.bar();							//43
```
Collections methods will, at some point, expose unique id management, and object updates based on identification.

####Prefix
```javascript
fooModel.prefix = 'FOOBAR';
```

This config serves a typing purpose. It's used for error strings in 'is' methods, but also as prefix to id for localStorage key generation. (see my other [decorators](./DECORATING.md))
