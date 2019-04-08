"use strict";

require("core-js/modules/es.symbol.description");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiffDOM = void 0;

var _index = require("./dom/index");

var _index2 = require("./virtual/index");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const DEFAULT_OPTIONS = {
  debug: false,
  diffcap: 10,
  // Limit for how many diffs are accepting when debugging. Inactive when debug is false.
  maxDepth: false,
  // False or a numeral. If set to a numeral, limits the level of depth that the the diff mechanism looks for differences. If false, goes through the entire tree.
  maxChildCount: 50,
  // False or a numeral. If set to a numeral, does not try to diff the contents of nodes with more children if there are more than maxChildDiffCount differences among child nodes.
  maxChildDiffCount: 3,
  // Numeral. See maxChildCount.
  valueDiffing: true,

  // Whether to take into consideration the values of forms that differ from auto assigned values (when a user fills out a form).
  // syntax: textDiff: function (node, currentValue, expectedValue, newValue)
  textDiff(node, currentValue, expectedValue, newValue) {
    node.data = newValue;
    return;
  },

  // empty functions were benchmarked as running faster than both
  // `f && f()` and `if (f) { f(); }`
  preVirtualDiffApply() {},

  postVirtualDiffApply() {},

  preDiffApply() {},

  postDiffApply() {},

  filterOuterDiff: null,
  compress: false,
  // Whether to work with compressed diffs
  _const: false,
  // object with strings for every change types to be used in diffs.
  document: window && window.document ? window.document : false
};

class DiffDOM {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.options = options; // IE11 doesn't have Object.assign and buble doesn't translate object spreaders
    // by default, so this is the safest way of doing it currently.

    Object.entries(DEFAULT_OPTIONS).forEach((_ref) => {
      let _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      if (!Object.prototype.hasOwnProperty.call(this.options, key)) {
        this.options[key] = value;
      }
    });

    if (!this.options._const) {
      const varNames = ["addAttribute", "modifyAttribute", "removeAttribute", "modifyTextElement", "relocateGroup", "removeElement", "addElement", "removeTextElement", "addTextElement", "replaceElement", "modifyValue", "modifyChecked", "modifySelected", "modifyComment", "action", "route", "oldValue", "newValue", "element", "group", "from", "to", "name", "value", "data", "attributes", "nodeName", "childNodes", "checked", "selected"];
      this.options._const = {};

      if (this.options.compress) {
        varNames.forEach((varName, index) => this.options._const[varName] = index);
      } else {
        varNames.forEach(varName => this.options._const[varName] = varName);
      }
    }

    this.DiffFinder = _index2.DiffFinder;
  }

  apply(tree, diffs) {
    return (0, _index.applyDOM)(tree, diffs, this.options);
  }

  undo(tree, diffs) {
    return (0, _index.undoDOM)(tree, diffs, this.options);
  }

  diff(t1Node, t2Node) {
    const finder = new this.DiffFinder(t1Node, t2Node, this.options);
    return finder.init();
  }

}

exports.DiffDOM = DiffDOM;