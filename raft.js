!function(env) {
	'use strict';
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = raft;
	else if (typeof define === "function" && define.amd) define(raft);
	else env.raft = raft();

	function raft() {
		return function classFactory(model) {
			var _reserved = [
				'toJSON',
				'save',
				'update',
				'load',
				'create',
				'find'
			];
			/* CONSTRUCTOR */
			var Class = function(values) {
				values = values || {};
				for (var name in model.attributes)
					this['_'+name] = values[name] || model.attributes[name].default;	
			};
			/*! CONSTRUCTOR !*/
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
			/*  COLLECTIONS  */
			if (model.collections) {
				for (var collection in model.collections) {

				}
			}/*! COLLECTIONS !*/
			/*  OBJECTS  */
			if (model.objects) {
				for (var object in model.objects) {

				}
			}/*! OBJECTS !*/
			/*  INSTANCE METHODS  */
			if (model.methods) {
				for (var method in model.methods) {

				}
			}/*! INSTANCE METHODS !*/
			/*  CLASS METHODS  */
			if (model.statics) {
				for (var method in model.statics) {

				}
			}/*! CLASS METHODS !*/
			/*  DEFAULT INSTANCE METHOD  */
			if (_reserved) {
				Class.prototype.toJSON = function () {
					var _obj = {};
					for(var name in model.attributes)
						_obj[name] = this[name]();
					/* 
					** TODO
					** for collections and objects
					*/
					return JSON.stringify(_obj);
				};
				Class.prototype.update = function (obj) {
					for(var name in model.attributes) {
						if (obj[name])
							this[name](obj[name]);
					/* 
					** TODO
					** for collections and objects
					*/
					}
				};
			}
			/*! DEFAULT INSTANCE METHOD !*/
			/*  DEFAULT CLASS METHOD  */
			if (_reserved) {

			}
			/*! DEFAULT CLASS METHOD !*/
			/* KEEP AT THE END */
			return Class;
		};
	}
}(this);
