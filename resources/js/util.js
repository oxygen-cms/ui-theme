/**
 * Get closest DOM element up the tree matches the selector
 * @param  {Node} elem The base element
 * @param  {String} selector The selector to look for
 * @return {Node} Null if no match
 */
function parentMatchingSelector(elem, selector) {

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

        if(selectorMatches(elem, selector)) {
            return elem;
        }
    }

    return null;
}

 function parentOrSelfMatchingSelector(elem, selector) {
    if(selectorMatches(elem, selector)) {
        return elem;
    }

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

        if(selectorMatches(elem, selector)) {
            return elem;
        }
    }

    return null;
}

//
// NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

function selectorMatches(el, selector) {
    var p = Element.prototype;
    var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
    };
    return f.call(el, selector);
}

// Element.prototype.matchesSelector = function(selector) {
//     return this[matchesMethod](selector);
// };

export { parentMatchingSelector, parentOrSelfMatchingSelector, selectorMatches };