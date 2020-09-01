"use strict";

(function () {
  var buyLinks = $all('[data-buy-link]');
  var allItems = $all('[data-item]');
  var itemsBody = $all(':not(.disabled)[data-item] [data-item-element="body"]');
  setDefaultState(allItems);
  addListeners(buyLinks, 'click', setStateByLink);
  addListeners(itemsBody, 'click', setStateByBody);

  function addListeners(elements, eventName, func) {
    elements.forEach(function (el) {
      el.addEventListener(eventName, func);
    });
  }

  function addHoverState(item) {
    item.classList.add('hover');
    var itemTitle = $('[data-item-element="title"]', item);
    var titleTexts = itemTitle.children;
    editText(titleTexts, 'chosen');
  }

  function changeTextFooter(item, state) {
    var footer = $('[data-item-element="footer"]', item);
    var footerTexts = footer.children;
    editText(footerTexts, state);
  }

  function changeHoverLeave(item, e) {
    var isChosen = item.classList.contains('chosen');

    if (isChosen) {
      addHoverState(item);
    } else {
      removeHoverState(item);
    }
  }

  function editText(containerTexts, state) {
    for (var key in containerTexts) {
      if (containerTexts.hasOwnProperty(key)) {
        var textNode = containerTexts[key];
        textNode.dataset.itemState === state ? textNode.classList.add('active') : textNode.classList.remove('active');
      }
    }
  }

  function removeHoverState(item) {
    var itemTitle = $('[data-item-element="title"]', item);
    var titleTexts = itemTitle.children;
    item.classList.remove('hover');
    editText(titleTexts, 'default');
  }

  function setDefaultState(items) {
    items.forEach(function (item) {
      var body = $('[data-item-element="body"]', item);

      if (item.classList.contains('disabled')) {
        changeTextFooter(item, 'disabled');
      }
    });
  }

  function setStateByBody(e) {
    var indexItem = e.currentTarget.dataset.body;
    var item = $("[data-item=\"".concat(indexItem, "\"]"));
    var body = $('[data-item-element="body"]', item);
    var isChosen = item.classList.contains('chosen');
    var isDisabled = item.classList.contains('disabled');

    if (!isDisabled && !isChosen) {
      item.classList.add('chosen');
      changeTextFooter(item, 'chosen');
      this.addEventListener('mouseleave', changeHoverLeave.bind(this, item));
    } else if (!isDisabled && isChosen) {
      item.classList.remove('chosen');
      changeTextFooter(item, 'default');
      changeHoverLeave(item);
    }
  }

  function setStateByLink(e) {
    e.preventDefault();
    var indexItem = e.target.dataset.buyLink;
    var item = $("[data-item=\"".concat(indexItem, "\"]"));
    item.classList.add('chosen');
    changeTextFooter(item, 'chosen');
    addHoverState(item);
  }

  function $(selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return parent.querySelector(selector);
  }

  function $all(selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return parent.querySelectorAll(selector);
  }
})();