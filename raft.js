!function(env) {
	'use strict';
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = raft;
	else if (typeof define === "function" && define.amd) define(raft);
	else env.raft = raft();

	function raft() {

		function classFactory(model) {
			var _reserved = [
				'toJSON',
				'save',
				'update',
				'load',
				'create',
				'find'
			];

			/*  COLLECTION CONSTRUCTOR  */
			function Collection (constructor, values) {
				this._objects = [];
				this._constructor = constructor;
				if (values)
					this.set(values);
			}
			/*  COLLECTION METHODS  */
			// 'set' takes an array litteral and deletes the old array. Should be rethought heavily.
			Collection.prototype.set = function (array) {
				var self = this;
				this._objects = array.map(function (item) {
					return new self._constructor(item);
				})
			};
			// TODO
			// 'findOne' takes an object litteral
			Collection.prototype.findOne = function(obj) {

			};
			// 'update' takes an array litteral that should be colinear to the collection array. Should be rethought heavily :
			// should it search for items in the collection for each item in the array?
			// should it update the items in the array and ignore the rest ? Delete the rest ?
			Collection.prototype.update = function(array) {
				for (var i in this._objects)
					this._objects[i].update(array[i]);
			};
			// should be monomorphic.
			// If the obj is in the collection, should it update it ? reset it ?
			Collection.prototype.add = function(obj) {
				if (obj instanceof Class)
					return this._objects.push(obj);
				else
					return this._objects.push(new this._constructor(obj));
			};
			// should we maintain an array of 'toJSON' up to date and serve it when required ?
			Collection.prototype.toJSON = function () {
				var _id = this._constructor.model.id || 'id';
				return this._objects.map(function (item) {
					var _ret = {};
					_ret[_id] = item.id();
					return _ret;
				});
			};
			Collection.prototype.pluck = function (values) {
				return this._objects.map(function (item) {
					return item.pluck(values);
				});
			};
			/*! COLLECTION METHODS !*/
			/*  DECORATING COLLECTION  */
			for (var name in _decorators)
				Collection = _decorators[name].collection(Collection, model);
			/*! DECORATING COLLECTION !*/
			/*! COLLECTION CONSTRUCTOR !*/

			/* CLASS CONSTRUCTOR */
			var Class = function(values) {
				values = values || {};
				/*  ATTRIBUTES  */
				for (var name in model.attributes)
					this['_'+ name] = values[name] || model.attributes[name].default;
				/* !ATTRIBUTES !*/
				/*  COLLECTIONS  */
				for (var collection in model.collections)
					this[collection] = new Collection (model.collections[collection].type, values[collection]);
				/*! COLLECTIONS !*/
				/*  OBJECTS  */
				for (var object in model.objects)
					this[object] = new model.objects[object].type(values[object]);
				/*! OBJECTS !*/
			};
			/*! CLASS CONSTRUCTOR !*/
			/*  VARIABLES  */
			var _isPromises = {};
			/*! VARIABLES !*/
			/*  ATTRIBUTES  */
			if (model.attributes) {
				for (var name in model.attributes) {
					/*  GETTER SETTER  */
					Class.prototype[name] = getterSetter(name);
					/*! GETTER SETTER !*/
					/*  IS  */
					for (var method in model.attributes[name].is) {
						var _nameIsMethod = [name, 'Is', method].join('');
						/*  ATTRIBUTE IS METHOD  */
						Class.prototype[_nameIsMethod] = attributeIsMethod(name, method);
						/*! ATTRIBUTE IS METHOD !*/
						/*  INSTANCE IS METHOD PUBLISH  */
						if (_isPromises[method] == null)
				 			_isPromises[method] = [];
				 		_isPromises[method].push(Class.prototype[_nameIsMethod]);
				 		/*!  INSTANCE IS METHOD PUBLISH !*/
					}/*! IS !*/
				}
				/*  INSTANCE IS METHOD SUBS  */
				for (var method in _isPromises)
					Class.prototype[['is', method].join('')] = isMethod(_isPromises[method]);
				/*! INSTANCE IS METHOD SUBS !*/

				/*  ATTRIBUTES FUNCTIONS  */
				function isMethod (promiseArray) {
					return function () {
						var self = this;
						return Promise.all(promiseArray.map(function (promise) {
							return promise.bind(self)();
						}));
					};
				}
				function attributeIsMethod (varName, methodName) {
					return function () {
						var self = this;
						return new Promise(function (resolve, reject) {
							if (model.attributes[varName].is[methodName].bind(self, Class.prototype[varName].bind(self))())
								resolve(Class.prototype[varName].bind(self));
							else
								reject(model.prefix + '/' + varName + ': \'' + self[varName]() + '\' is not ' + methodName);
						});
					};
				}
				function getterSetter(varName) {
					return function(/*value*/) {
						if (arguments.length)
							this['_'+varName] = arguments[0];
						return this['_'+varName];
					};
				}
				/*! ATTRIBUTES FUNCTIONS !*/
			}/*! ATTRIBUTES !*/
			/*  OBJECTS  */
			if (model.objects) {
				for (var object in model.objects) {

				}
			}/*! OBJECTS !*/
			/*  INSTANCE METHODS  */
			if (model.methods) {
				for (var method in model.methods) {
					Class.prototype[method] = model.methods[method];
				}
			}/*! INSTANCE METHODS !*/
			/*  CLASS METHODS  */
			if (model.statics) {
				for (var method in model.statics) {

				}
			}/*! CLASS METHODS !*/
			/*  DEFAULT INSTANCE METHOD  */
			if (_reserved) {
				/*  ID  */
				Class.prototype.id = (Class.prototype.id != null)
					? Class.prototype.id
					: (model.id == null)
						? function () {return (model.prefix);}
						: Class.prototype[model.id];
				/*! ID !*/
				/*  VERSION  */
				Class.prototype.version = (Class.prototype.version != null)
					? Class.prototype.version
					: (model.version == null)
						? function () {return ('0');}
						: Class.prototype[model.version];
				/*! VERSION !*/
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
				// 'update' takes an object litteral.
				// We might use, like for 'save', an optional option object to describe recursivity, reset/refresh behaviour for collection, etc.
				Class.prototype.update = function (obj) {
					/*  ATTRIBUTES  */
					for(var name in model.attributes) {
						if (obj[name])
							this[name](obj[name]);
					}/*! ATTRIBUTES !*/
					/*  COLLECTIONS  */
					// 'set' is a hard resetting update, update is not yet fully defined.
					// expect this behaviour to change
					for (var collection in model.collections) {
						if (obj[collection])
							this[collection].set(obj[collection]);
					}/*! COLLECTIONS !*/
					/*  OBJECTS  */
					// needs some use case to drive this behaviour
					for (var object in model.objects) {

					}/*! OBJECTS !*/
				};
				Class.prototype.expose = function (request) {
					var _obj = {};
					for (var field in request) {
						_obj[request[field]] = this[request[field]].bind(this);
					}
					return _obj;
				};
				Class.prototype.pluck = function (request) {
					var _obj = {};
					for (var field in request)
						_obj[request[field]] = this[request[field]]();
					return _obj;
				};
			}
			/*! DEFAULT INSTANCE METHOD !*/
			/*  DEFAULT CLASS METHOD  */
			if (_reserved) {
				Class.create = function (obj) {
					return new Class(obj);
				};
				Class.current = function() {
					if (arguments.length)
						Class._current = arguments[0];
					return Class._current;
				};
			}
			/*! DEFAULT CLASS METHOD !*/
			/*  DECORATING CLASS  */
			for (var name in _decorators)
				Class = _decorators[name].class(Class, model);
			/*! DECORATING CLASS !*/
			/* KEEP AT THE END */
			Class.model = model;
			return Class;
		};
		//
		var _decorators
		classFactory.decorate = function (decorators) {
			_decorators = decorators;
		};
		return classFactory;
	}
}(this);
