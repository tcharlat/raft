var should = require('should');
var Raft   = require('../../raft.js');

var model = {
	attributes: {
		foo: {
			default: 'bar'
		},
		baz: {

		}
	}
};

var Constructor = Raft(model);

var instanceOne = new Constructor();
var instanceTwo = new Constructor({foo: 'baz'});

describe('raft', function () {
	describe('Raft', function () {
		it('should be loaded', function () {
			Raft.should.be.Function()
		})
	});

	describe('entry model', function () {
		it('should have a basic model with attribute foo and default bar', function () {
			model.should.have.ownProperty('attributes').have.ownProperty('foo').have.ownProperty('default').be.equal('bar')
		});
		it('should have property baz empty', function () {
			model.should.have.propertyByPath('attributes', 'baz').be.empty();
		});
	});

	describe('class creation', function () {
		it('should return a class from the base model', function () {
			Constructor.should.be.Function();
		});
	});

	describe('model instanciation', function () {

		describe('instanceOne', function () {
			var instance = instanceOne;

			it('should have foo property unchanged (bar)', function () {
				instance.should.have.ownProperty('foo').obj().should.be.equal('bar');
			});
			it('should have baz undefined', function () {
				should(instance.should.have.ownProperty('baz').obj()).be.undefined();
			});
			it('instance.foo(42) and return 42', function () {
				instance.foo(42).should.be.equal(42);
			});
			it('instance.foo should be equal to 42', function () {
				instance.foo().should.be.equal(42);
			});
		});

		describe('instanceTwo', function () {
			var instance = instanceTwo;

			it('should have foo property changed (baz)', function () {
				instance.should.have.ownProperty('foo').obj().should.be.equal('baz');
			});
			it('should have baz undefined', function () {
				should(instance.should.have.ownProperty('baz').obj()).be.undefined();
			});
		});

		describe('instance methods', function () {
			var instance = instanceOne;

			it('should have toJSON methods', function () {
				instanceOne.toJSON.should.be.Function()
			});

			it('should return a stringify JSON object', function () {
				should(instanceOne.toJSON()).be.String();
			})
		})
	})

});
