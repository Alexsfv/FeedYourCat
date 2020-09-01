(function() {
    const buyLinks = $all('[data-buy-link]');
    const allItems = $all('[data-item]');
    const itemsBody = $all(':not(.disabled)[data-item] [data-item-element="body"]');

    setDefaultState(allItems);

    addListeners(buyLinks, 'click', setStateByLink);
    addListeners(itemsBody, 'click', setStateByBody);


    function addListeners(elements, eventName, func) {
        elements.forEach(function(el) {
            el.addEventListener(eventName, func);
        })
    }

    function addHoverState(item) {
        item.classList.add('hover');
        const itemTitle = $('[data-item-element="title"]', item);
        const titleTexts = itemTitle.children;
        editText(titleTexts, 'chosen');
    }

    function changeTextFooter(item, state) {
        const footer = $('[data-item-element="footer"]', item);
        const footerTexts = footer.children;
        editText(footerTexts, state);
    }

    function changeHoverLeave(item, e) {
        const isChosen = item.classList.contains('chosen');
        if (isChosen) {
            addHoverState(item);
        } else {
            removeHoverState(item);
        }
    }

    function editText(containerTexts, state) {
        for (let key in containerTexts) {
            if (containerTexts.hasOwnProperty(key)) {
                const textNode = containerTexts[key];
                textNode.dataset.itemState === state ?
                    textNode.classList.add('active'):
                    textNode.classList.remove('active');
            }
        }
    }

    function removeHoverState(item) {
        const itemTitle = $('[data-item-element="title"]', item);
        const titleTexts = itemTitle.children;
        item.classList.remove('hover');
        editText(titleTexts, 'default');
    }
    
    function setDefaultState(items) {
        items.forEach((item) => {
            const body = $('[data-item-element="body"]', item);
            if (item.classList.contains('disabled')) {
                changeTextFooter(item, 'disabled');
            }
        });
    }

    function setStateByBody(e) {
        const indexItem = e.currentTarget.dataset.body;
        const item = $(`[data-item="${indexItem}"]`);
        const body = $('[data-item-element="body"]', item);
        const isChosen = item.classList.contains('chosen');
        const isDisabled = item.classList.contains('disabled');

        if (!isDisabled && !isChosen) {
            item.classList.add('chosen');
            changeTextFooter(item, 'chosen');
            this.addEventListener('mouseleave', changeHoverLeave.bind(this, item));
        } else if (!isDisabled && isChosen) {
            item.classList.remove('chosen');
            changeTextFooter(item, 'default');
            changeHoverLeave(item)
        }
    }

    function setStateByLink(e) {
        e.preventDefault();
        const indexItem = e.target.dataset.buyLink;
        const item = $(`[data-item="${indexItem}"]`);
        item.classList.add('chosen');
        changeTextFooter(item, 'chosen');
        addHoverState(item);
    }

    function $(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function $all(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }
})();