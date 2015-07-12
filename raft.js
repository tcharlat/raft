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
			**
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

	Class.prototype.is = {};

			/* INSTANCE METHODS */

			Class.prototype.save = function save () {
				//
				// return new Promise(function (resolve, reject) {
				// 	localStorage.setItem(this._id(), 'test');
				// });
			};

			Class.prototype.valid = function valid () {
				//promise array =
				//	for each getter setter, 
				//
				var array = [];

				for (var name in model.attributes) {
					array.push(this[name].is.valid());
				}
				return Promise.all(array);
			};

			Class.prototype.current = function current () {
				Class.current = this;
			};

			/* ! INSTANCE METHODS ! */

			Class.current;

			/* INSTANCE PRIVATE */

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
					resolve(new Class(attributes));
				});
			};

			Class.find = function find () {
				//returns an array
			};

			Class.get = function get () {
				//returns a promise or an object ?
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

