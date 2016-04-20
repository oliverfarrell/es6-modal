/**
 * TODO
 *
 * - Auto pause any video that might be included in a modal
 * - Implement pushState to change the URL when opening/closing a modal
 * - Add a callback that can be fired when the modal loads
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Modal = function () {
  function Modal(settings) {
    _classCallCheck(this, Modal);

    // Define an empty options object
    var options = {};

    // Merge the user defined settings with the options object
    Object.assign(options, settings);

    // Define the modal selector
    this.selector = options.selector || '[data-modal]';

    // Define the selector that will close a modal instance
    this.closeSelector = options.closeSelector || '[data-modal-close]';

    // Define the selector that will trigger the modal instance
    this.showSelector = options.showSelector || '[data-modal-id]';

    // Define whether the modal should follow
    // the user down the page when they scroll
    this.isFixed = options.isFixed || true;

    // Define the class that is added to the modal
    // when it is active and visible
    this.activeClass = options.activeClass || 'is-active';

    // Define the class that is added to the <body>
    // when the modal is active and visible
    this.bodyClass = options.bodyClass || 'modal-is-active';

    // Bind `this` to the method so we can use it
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.show = this.show.bind(this);
    this.hideAll = this.hideAll.bind(this);
    this.onPopstate = this.onPopstate.bind(this);

    // Add event listeners
    this.addEventListeners();
  }

  _createClass(Modal, [{
    key: 'addEventListeners',
    value: function addEventListeners() {

      // 1. Add event listeners for touch devices
      document.addEventListener('touchstart', this.onClick);

      // 2. Add event listeners for mouse inputs
      document.addEventListener('mousedown', this.onClick);

      // 3. Add event listeners on keydown
      document.addEventListener('keydown', this.onKeydown);

      // 4. Add event listeners on load
      window.addEventListener('load', this.onLoad);

      // 5. Add event listeners on popstate
      window.addEventListener('popstate', this.onPopstate);
    }
  }, {
    key: 'onClick',
    value: function onClick(evt) {

      // 1. If the target element matches `this.showSelector`
      if (evt.target.matches(this.showSelector)) {

        // 1. Store the ID of the modal being requested
        var modalId = evt.target.dataset.modalId;

        // 2. If there is a modal ID, show the modal that matches
        if (modalId) this.show(modalId);

        // 2. If the target element matches `this.closeSelector`
      } else if (evt.target.matches(this.closeSelector)) {

          // 1. Store the ID of the modal being hidden
          var _modalId = evt.target.parentNode.id;

          // 2. If there is a modal ID, hide the modal that matches
          if (_modalId) this.hide(_modalId);

          // 3. If the target element is the `.overlay`
        } else if (evt.target.matches('.overlay')) {

            // 1. Close everything
            this.hideAll();

            // 4. Otherwise it was none of the above, so cancel.
          } else {

              return;
            }

      // 5. Prevent the default functionality of whatever is being clicked
      evt.preventDefault();
    }
  }, {
    key: 'onKeydown',
    value: function onKeydown(evt) {

      // 1. If user hits `esc` key, close everything
      if (evt.keyCode === 27) this.hideAll();
    }
  }, {
    key: 'onLoad',
    value: function onLoad(evt) {

      var hash = window.location.hash.substring(1);

      if (hash) {
        var modal = document.getElementById(hash);

        if (modal) this.show(modal.id);
      }
    }
  }, {
    key: 'onPopstate',
    value: function onPopstate() {

      this.hideAll();
      this.onLoad();
    }
  }, {
    key: 'pauseVideo',
    value: function pauseVideo(modal) {

      var iframe = modal.querySelector('iframe'),
          video = modal.querySelector('video');

      if (iframe) {
        var iframeSrc = iframe.src;
        iframe.src = iframeSrc;
      }

      if (video) {
        video.pause();
      }
    }
  }, {
    key: 'show',
    value: function show(id) {

      // 1. Grab the modal that matches the ID
      var modal = document.getElementById(id);

      // 2. Add an overlay to disable the rest of the site
      if (!document.querySelector('.overlay')) {
        var overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.classList.add(this.activeClass);
        document.body.appendChild(overlay);
      }

      // 3. Add an active class to the modal instance
      modal.classList.add(this.activeClass);

      // 4. Add an active class to the <body>
      document.body.classList.add(this.bodyClass);

      // 5. Change the URL
      window.history.pushState(null, 'modal ' + id, '#' + id);
    }
  }, {
    key: 'hide',
    value: function hide(id) {

      // 1. Grab the modal that matches the ID
      var modal = document.getElementById(id);

      // 2. Pause any audio/video that might be playing
      this.pauseVideo(modal);

      // 3. Remove the active class to the modal instance
      modal.classList.remove(this.activeClass);

      // 4. If there are no modals active
      if (!document.querySelector(this.selector + '.' + this.activeClass)) {

        // 1. Remove the overlay
        var overlay = document.querySelector('.overlay');
        overlay.parentNode.removeChild(overlay);

        // 2. Remove the active class from the body
        document.body.classList.remove(this.bodyClass);

        // 3. Change the URL
        window.history.pushState(null, document.title, window.location.pathname);
      }
    }
  }, {
    key: 'hideAll',
    value: function hideAll() {

      // 1. Grab all active models
      var modals = document.querySelectorAll(this.selector + '.' + this.activeClass);

      // 2. Hide each active modal
      for (var i = 0; i < modals.length; i++) {
        var modal = modals[i];
        this.hide(modal.id);
      }
    }
  }]);

  return Modal;
}();
