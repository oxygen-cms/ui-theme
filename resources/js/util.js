/**
 * Get closest DOM element up the tree matches the selector
 * @param  {Node} elem The base element
 * @param  {String} selector The selector to look for
 * @return {Node} Null if no match
 */
var parentMatchingSelector = function (elem, selector) {

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

        if(elem.matchesSelector(selector)) {
            return elem;
        }
    }

    return null;
};

var parentOrSelfMatchingSelector = function (elem, selector) {
    if(elem.matchesSelector(selector)) {
        return elem;
    }

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

        if(elem.matchesSelector(selector)) {
            return elem;
        }
    }

    return null;
};

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

var matchesMethod = (function() {
    var ElemProto = Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
        return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
        return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
        var prefix = prefixes[i];
        var method = prefix + 'MatchesSelector';
        if ( ElemProto[ method ] ) {
            return method;
        }
    }
})();

Element.prototype.matchesSelector = function(selector) {
    return this[matchesMethod](selector);
};
