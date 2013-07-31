function mustImplement(message) {
  var fn = function() {
    var className = this.constructor.toString();

    throw new Error(message.replace('{{className}}', className));
  };
  fn.isUnimplemented = true;
  return fn;
}
var get = Ember.get,
    set = Ember.set;
Ember.Adapter = Ember.Object.extend({
  find: mustImplement('{{className}} must implement find'),
  findQuery: mustImplement('{{className}} must implement findQuery'),
  findMany: mustImplement('{{className}} must implement findMany'),
  findAll: mustImplement('{{className}} must implement findAll'),
  createRecord: mustImplement('{{className}} must implement createRecord'),
  saveRecord: mustImplement('{{className}} must implement saveRecord'),
  deleteRecord: mustImplement('{{className}} must implement deleteRecord'),

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
