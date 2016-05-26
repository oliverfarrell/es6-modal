# Modals

Simple modals / popups / lightboxes.

[Download](https://github.com/oliverfarrell/es6-modal/archive/master.zip)

## Getting Started

### Using NPM
Getting started couldn't be easier. If you're using something like webpack, or browserify you can use the package like so.

```javascript
const Modal = require('super-simple-modals');

new Modal({
  selector: '.modal',
  onShow: function () {
    console.log('showing!');
  },
  onHide: function () {
    console.log('hiding!');
  }
});
```
