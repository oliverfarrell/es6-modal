/**
 * TODO
 *
 * - Auto pause any video that might be included in a modal
 * - Implement pushState to change the URL when opening/closing a modal
 */

'use strict';

class Modal {

  constructor (settings) {

    // Define an empty options object
    let options = {};

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

    // Add event listeners
    this.addEventListeners();

  }

  addEventListeners () {

    // 1. Add event listeners for touch devices
    document.addEventListener('touchstart', this.onClick);

    // 2. Add event listeners for mouse inputs
    document.addEventListener('mousedown', this.onClick);

    // 3. Add event listeners on keydown
    document.addEventListener('keydown', this.onKeydown);

    // 4. Add event listeners on load
    window.addEventListener('load', this.onLoad);

  }

  onClick (evt) {

    // 1. If the target element matches `this.showSelector`
    if (evt.target.matches(this.showSelector)) {

      // 1. Store the ID of the modal being requested
      let modalId = evt.target.dataset.modalId;

      // 2. If there is a modal ID, show the modal that matches
      if (modalId)
        this.show(modalId);

    // 2. If the target element matches `this.closeSelector`
    } else if (evt.target.matches(this.closeSelector)) {

      // 1. Store the ID of the modal being hidden
      let modalId = evt.target.parentNode.id;

      // 2. If there is a modal ID, hide the modal that matches
      if (modalId)
        this.hide(modalId);

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

  onKeydown (evt) {

    // 1. If user hits `esc` key, close everything
    if(evt.keyCode === 27)
      this.hideAll();

  }

  onLoad (evt) {

    let hash = window.location.hash.substring(1);

    if(hash) {
      let modal = document.getElementById(hash);

      if(modal)
        this.show(modal.id);
    }

  }

  show (id) {

    // 1. Grab the modal that matches the ID
    const modal = document.getElementById(id);

    // 2. Add an overlay to disable the rest of the site
    if (!document.querySelector('.overlay')) {
      let overlay = document.createElement('div');
      overlay.classList.add('overlay');
      overlay.classList.add(this.activeClass);
      document.body.appendChild(overlay);
    }

    // 3. Add an active class to the modal instance
    modal.classList.add(this.activeClass);

    // 4. Add an active class to the <body>
    document.body.classList.add(this.bodyClass);

  }


  hide (id) {

    // 1. Grab the modal that matches the ID
    const modal = document.getElementById(id);

    // 2. Remove the active class to the modal instance
    modal.classList.remove(this.activeClass);

    // 3. If there are no modals active
    if (!document.querySelector(this.selector + '.' + this.activeClass)) {

      // 1. Remove the overlay
      let overlay = document.querySelector('.overlay');
      overlay.parentNode.removeChild(overlay);

      // 2. Remove the active class from the body
      document.body.classList.remove(this.bodyClass);

    }

  }

  hideAll () {

    // 1. Grab all active models
    const modals = document.querySelectorAll(this.selector + '.' + this.activeClass);

    // 2. Hide each active modal
    for (var i = 0; i < modals.length; i++) {
      let modal = modals[i];
      this.hide(modal.id);
    }

  }

}
