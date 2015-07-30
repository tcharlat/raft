# raft
A lightweight JS class builder. With tools.

![build](https://travis-ci.org/Kallikrein/raft.svg?branch=master)

## what is raft  
Raft is a lightweight JS class builder.
It can be used in the browser and allows you to easily build class constructors from a simple model. 
It is compatible with AMD modules or through direct global include in your page.  

## install  
```bower install --save raft```  

## Usage  

### sample codes :  
Define your model as shown in the code below :  
```javascript
function myModel() {

	var Model = {
		prefix: 'myModel',
		id: 'firstAttribute',
		attributes: {
			firstAttribute: {
				type: 'string',
				required: true,
				is: {
					commonVerb: function (value) {
						if (value() == 'good value')
							return true;
						return false;
					}
				}
			},
			secondAttribute: {
				type: 'string',
				is: {
					commonVerb: function (value) {
						if (value() == 'another good value')
							return true;
						return false;
					},
					rareVerb: function (value) {
						if (value() == 'a specific value')
							return true;
						return false;
					},
					someVerb: aFunctionDefinedElsewhere
				}
			}
		},
		instanceMethods : {
			aSimpleInstanceMethod: function() {
				// do stuff : instance.method()
			}
		},
		classMethods : {
			aSimpleClassMethod: function() {
				// do stuff : Class.method()
			}
		}
	};
	return raft(Model);
}
```
Then you can instantiate your class by calling your model :

```javascript
var Class = myModel();
var instance = new Class({firstAttribute: 'goodValue'});
```  

### getter setters  
Now the instance is exposing getter-setters :
```javascript
instance.secondAttribute('a bad value');
instance.firstAttribute(); //'goodValue'
```  
### is methods
The instance is also exposing promises for each of your 'is' method:
```javascript
instance.secondAttribute.is.commonVerb()
.then(function(gettersetter) {
  console.log(gettersetter()); //'goodValue'
}).catch(console.log.bind(console));

instance.firstAttribute('bad value');
instance.secondAttribute.is.commonVerb()
.then(function(gettersetter) {
  console.log(gettersetter());
}).catch(console.log.bind(console)); // %PREFIX / %ATTRIBUTE : %VALUE is not %METHOD
```

But also a global promise :

```javascript
instance.is.commonVerb().then().catch();
```

This last syntaxic sugar lets you easily create homonymic methods for each of your attribute getter setter and validate (or any other logic on) your model in one pass.

### adaptors:  
raft-decorator-localStorage  
```bower install raft-decorator-localStorage --save ```  
## Todo

- This.
- minification
- backward incompatile semantics refactoring
- tests
- CI
- ~~Adaptors~~
- ~~collection attributes~~
