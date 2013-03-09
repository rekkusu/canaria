

test('canaria#require', function() {
  expect(4);
  canaria.require('sample');
  canaria.require('sample1', 'sample2', 'ns.sample');
  stop();
  setTimeout(function(){
    start();
    ok(canaria.sample, 'sample loaded');
    ok(canaria.sample1, 'sample1 loaded');
    ok(canaria.sample2, 'sample2 loaded');
    ok(canaria.ns.sample, 'ns.sample loaded');
  }, 100);
});

test('canaria#require(callback)', function() {
  expect(2);
  stop();
  canaria.require('some1', 'some2', function(){
    start();
    ok(canaria.some1, 'some1 loaded');
    ok(canaria.some2, 'some2 loaded');
  });
});
