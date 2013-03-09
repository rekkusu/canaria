# canaria

## Usage
```html
<!-- index.html -->
<script src="canaria.js" type="text/javascript"></script>
<script src="main.js" type="text/javascript"></script>
```

```javascript
// main.js
canaria.require('mylib', 'namespace.A', function(){
  // some code ...
});
```

```javascript
// lib/mylib.js
canaria.register('mylib', function() {
  var mylib = Object.create(...);
  return mylib;
});
