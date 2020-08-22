(function () {
    var buyLinks = $all('[data-buy-link]');
    var allItems = $all('[data-item]');
    var itemsBody = $all(':not(.disabled)[data-item] #item-body');

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
        var itemTitle = $("[data-item=\"".concat(item.dataset.item, "\"] #item-title"));
        var titleTexts = itemTitle.children;
        editText(titleTexts, 'chosen');
    }

    function changeTextFooter(item, state) {
      var footer = item.children['item-footer'];
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
            textNode.dataset.itemState === state?
                textNode.classList.add('active'):
                textNode.classList.remove('active');
            }
        }
    }
  
    function removeHoverState(item) {
      var itemTitle = $("[data-item=\"".concat(item.dataset.item, "\"] #item-title"));
      var titleTexts = itemTitle.children;
      item.classList.remove('hover');
      editText(titleTexts, 'default');
    }

    function setStateByLink(e) {
        e.preventDefault();
        var indexItem = e.target.dataset.buyLink;
        var item = $("[data-item=\"".concat(indexItem, "\"]"));
        item.classList.add('chosen');
        changeTextFooter(item, 'chosen');
        addHoverState(item);
    }
  
    function setStateByBody(e) {
      var indexItem = e.currentTarget.dataset.body;
      var item = $("[data-item=\"".concat(indexItem, "\"]"));
      var bodyItem = item.children['item-body'];
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

    function setDefaultState(items) {
        items.forEach(function (item) {
        var body = item.children['item-body'];

        if (item.classList.contains('disabled')) {
            changeTextFooter(item, 'disabled');
        }
        });
    }
  
    function $(selector) {
      return document.querySelector(selector);
    }
  
    function $all(selector) {
      return document.querySelectorAll(selector);
    }
  })();