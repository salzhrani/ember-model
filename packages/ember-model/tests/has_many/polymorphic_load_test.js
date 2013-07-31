var attr = Ember.attr;

module("Ember.HasManyArray - polymorphic objects loading");

test("loads polymorphic objects based on their ids", function() {
  expect(10);

  var json = {
    id: 1,
    title: 'foo',
    comments: [{id:1,type:'comment'}, {id:2,type:'pingback'},{id:3,type:'pingback'}]
  };

  var Comment = Ember.Model.extend({
    id: attr(),
    text: attr()
  });
  var Pingback = Comment.extend({
    url: attr(),
  });

  var Article = Ember.Model.extend({
    title: attr(),

    comments: Ember.hasMany(Comment, { key: 'comments',polymorphic:true })
  });

  var adapter = Ember.FixtureAdapter.create();
  Comment.adapter = adapter;
  adapter.setAlias ('comment',Comment);
  Comment.FIXTURES = [
    {id: 1, text: 'first comment'}
  ];

  ok(adapter.findClassFor('comment') == Comment,'alias lookup for comment ');

  Pingback.adapter = adapter;
  adapter.setAlias ('pingback',Pingback);
  Pingback.FIXTURES = [
    {id: 2, text: 'first pingback',url:'pingback_url'},
    {id: 3, text: 'second pingback',url:'pingback_url'}
  ];

  ok(adapter.findClassFor('pingback') == Pingback,'alias lookup for pingback');

  var article = Article.create();
  var comments = article.get('comments');

  equal(comments.get('length'), 0);

  Ember.run(article, article.load, json.id, json);

  stop();
  var commentPromises = comments.toArray().map(function(c) { return Ember.loadPromise(c); });
  var promise = Ember.RSVP.all(commentPromises);
  promise.then(function() {
    start();
    equal(comments.get('length'), 3, "There are 3 comments");
    ok(Ember.run(comments, comments.get, 'firstObject') instanceof Comment, "The first object is a Comment object");
    ok(Ember.run(comments, comments.objectAt, '1') instanceof Pingback, "The second object is a Pingback object");
    ok(Ember.run(comments, comments.objectAt, '2') instanceof Pingback, "The third object is a Pingback object");
    deepEqual(Ember.run(comments, comments.mapProperty, 'text'), ['first comment', 'first pingback', 'second pingback'], "The comments are loaded");
    deepEqual(Ember.run(comments, comments.mapProperty, 'url'), [undefined, 'pingback_url', 'pingback_url'], "The comments are loaded");
    ok(!comments.everyProperty('isNew'), "Records should not be new");
  });
});
