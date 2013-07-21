function mustImplement(message) {
  var fn = function() {
    throw new Error(message);
  };
  fn.isUnimplemented = true;
  return fn;
}
var get = Ember.get,
    set = Ember.set;
Ember.Adapter = Ember.Object.extend({
  find: mustImplement('Ember.Adapter subclasses must implement find'),
  findQuery: mustImplement('Ember.Adapter subclasses must implement findQuery'),
  findMany: mustImplement('Ember.Adapter subclasses must implement findMany'),
  findAll: mustImplement('Ember.Adapter subclasses must implement findAll'),
  createRecord: mustImplement('Ember.Adapter subclasses must implement createRecord'),
  saveRecord: mustImplement('Ember.Adapter subclasses must implement saveRecord'),
  deleteRecord: mustImplement('Ember.Adapter subclasses must implement deleteRecord'),

  load: function(record, id, data) {
    record.load(id, data);
  },
  setAlias : function(key, val) {
    var aliasMap = get(this,'aliasMap');
    if (!aliasMap)
    {
      aliasMap = {};
      set(this, 'aliasMap', aliasMap);
    }
    aliasMap[key] = val;
  },
  findClassFor : function(alias) {
    var aliasMap = get(this, 'aliasMap');
    return aliasMap[alias];
  }
});