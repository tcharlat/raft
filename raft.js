!function(env) {
	'use strict';
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = raft;
	else if (typeof define === "function" && define.amd) define(raft);
	else env.raft = raft();

	function raft() {

		return classFactory;

		function classFactory(model) {
			var _arraysPromise = {};
			

			/* CONSTRUCTOR */
			var Class = function(values) {
				var self = this;

				/*
				** defines a getter setter for each variable in the model attributes : {}
				** if a fields had a default value define in the model attributes default,
				** sets the get-set to this value
				*/

				/*
				** Since some logic has to be executed once at the creation of the constructor (sic),
				** we should check that we are not executing unnecessary redundant construction instructions
				** and kick some loops out of the constructor
				*/
				values = values || {};
				for (var name in model.attributes) {
					self[name] = getterSetter(values[name] || model.attributes[name].default);
					/*
					** defines a subfunction attached to the getter-setter for each method in
					** the model.attributes.is : {}
					*/
					for (var method in model.attributes[name].is) {
						if (self[name].is == null)
							self[name].is = {};
						self[name].is[method] = isMethod (
							name,
							method,
							model.attributes[name].is[method],
							self[name]
						);
						if (_arraysPromise[method] == null)
							_arraysPromise[method] = [];
						_arraysPromise[method].push(self[name].is[method]);

						/**
						** this big fat ugly closure should be externalised for clarity !
						** for each instance.gettersetter.is.method() that is defined at least once,
						** creates an instance method that returns a promise fiwn
						** instance
						*/
						Class.prototype.is[method] = (function(methodName) {
							return function() {
								return Promise.all(_arraysPromise[methodName].map(function (promise){
									return promise();
								}));
							};
						})(method);
					}

				}
				/*
				** defines an instance.method() for each variable in the model instanceMethods : {}
				*/
				for (var name in model.instanceMethods) {
					self[name] = model.instanceMethods[name];
				}

				/*
				** If the model has a field that will be used as a save ID, defines a _id() function that
				** returns the custom identifier for this instance.
				** Else, the class is a singleton and is stored/id'd under the prefix key only.
				*/
				if (model.id) {
					self._id = function _id () {
						return model.prefix + '/'+ self[model.id]();
					};
				}
				else
					self._id = function _id () {
						return model.prefix;
					};
			};

			/* !CONSTRUCTOR! */

			/*
			** Might not be the best way to manage a closure. We should definitely audit this at some point
			*/
			function isMethod (varName, methodName, method, getterSetter) {
				return (function (_varName, _methodName, _method, _getterSetter) {
					return function () {
						return new Promise(function (resolve, reject) {
							if (_method.bind(null, _getterSetter)())
								resolve(_getterSetter);
							else
								reject(model.prefix + '/' + varName + ': \'' + _getterSetter() + '\' is not ' + methodName);
						});
					};
				})(varName, methodName, method, getterSetter);
			}

			/*
			** TODO :
			** This object should be created only if there is at least one if method
			*/
			Class.prototype.is = {};

			/* INSTANCE METHODS */

			Class.prototype.update = function (obj) {
				for(var name in model.attributes) {
					if (obj[name])
						this[name](obj[name]);
				}
			};
			Class.prototype.toJSON = function () {
				var _obj = {};
				for(var name in model.attributes) {
					_obj[name] = this[name]();
				}
				return JSON.stringify(_obj);
			};

			/*
			** This might be better defined as a custom model instance method
			*/
			Class.prototype.current = function current () {
				Class.current = this;
			};

			/* ! INSTANCE METHODS ! */
			/*
			** Idem for this variable
			*/
			Class.current;

			/* INSTANCE PRIVATE */

			/*
			** This function definition is highly unclear + it's not implemented.
			** should be solved ASAP
			*/
			function load () {};

			/* !INSTANCE PRIVATE! */

			/* STATIC METHODS */

			/*
			** defines a class.method() for each method in classMethods {}
			*/
			for (var name in model.classMethods)
			{
				Class[name] = model.classMethods[name];
			}

			Class.create = function create(attributes) {
				return new Promise(function(resolve) {
					/*
					** Should async creation fail ? under wich condition ?
					*/
					//if (someCheckIsNotPassing(attributes) || somethingIsNotRight())
					//	reject('clever error message');
					//else
					resolve(new Class(attributes));
				});
			};

			/*
			** TODO :
			** Should go in localStorage decorator
			*/
			Class.find = function find () {
				//returns an array
			};

			/* !STATIC METHODS! */

			return Class;
		}

		function getterSetter(store) {
			var prop = function(/*value*/) {
				if (arguments.length)
					store = arguments[0];
				return store;
			};
			return prop;
		}
	}
}(this);

// if (typeof module != "undefined" && module !== null && module.exports) module.exports = raft;
// else if (typeof define === "function" && define.amd) define(function() {return raft});

