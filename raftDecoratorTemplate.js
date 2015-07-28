!function(env) {
	'use strict';
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = <%= decorator %>;
	else if (typeof define === "function" && define.amd) define(<%= decorator %>);
	else env.<%= decorator %> = <%= decorator %>();

	function <%= decorator %>(){
		/*  LIB  */
		/*
		**  EXAMPLE
		**  function debug (value) {
		**  	console.log(value);
		**  };
		**! EXAMPLE
		*/
		/*! LIB !*/
		return {
			collection: function (inherits, constructor) {
				/*  COLLECTION INHERITAGE  */
				function Collection(constructor, value) {
					inherits.call(this, model, value);
				}
				for (var element in inherits.prototype) {
					if ({}.toString.call(inherits.prototype[element]).slice(8, -1) == 'Function' )
						Collection.prototype[element] = inherits.prototype[element];
				}
				for (var element in inherits) {
					if ({}.toString.call(inherits[element]).slice(8, -1) == 'Function' )
						Collection[element] = inherits[element];
				}
				/*! COLLECTION INHERITAGE !*/
				/*  COLLECTION METHODS  */
				/*
				**  EXAMPLE
				**  Collection.prototype.debug = function () {
				**  	debug(this);
				**  	return this;
				**  };
				**! EXAMPLE
				*/
				/*! COLLECTION METHODS !*/
				return Collection;
			},
			class: function (inherits, model) {
				/*  CLASS INHERITAGE  */
				function Class(value) {
					inherits.call(this, value);
				}
				for (var element in inherits.prototype) {
					if ({}.toString.call(inherits.prototype[element]).slice(8, -1) == 'Function' )
						Class.prototype[element] = inherits.prototype[element];
				}
				for (var element in inherits) {
					if ({}.toString.call(inherits[element]).slice(8, -1) == 'Function' )
						Class[element] = inherits[element];
				}
				/*! CLASS INHERITAGE !*/
				/*  CLASS METHODS  */
				/*
				**  EXAMPLE
				**  Class.prototype.debug = function () {
				**  	debug(this);
				**  	return this;
				**  };
				**! EXAMPLE
				*/
				/*! CLASS METHODS !*/
				return Class;
			}
		};
	}
}(this);