"use strict";

require("core-js/modules/es.symbol.description");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objToNode = objToNode;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function objToNode(objNode, insideSvg, options) {
  let node;

  if (objNode.nodeName === '#text') {
    node = options.document.createTextNode(objNode.data);
  } else if (objNode.nodeName === '#comment') {
    node = options.document.createComment(objNode.data);
  } else {
    if (objNode.nodeName === 'svg' || insideSvg) {
      node = options.document.createElementNS('http://www.w3.org/2000/svg', objNode.nodeName);
      insideSvg = true;
    } else {
      node = options.document.createElement(objNode.nodeName);
    }

    if (objNode.attributes) {
      Object.entries(objNode.attributes).forEach((_ref) => {
        let _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return node.setAttribute(key, value);
      });
    }

    if (objNode.childNodes) {
      objNode.childNodes.forEach(childNode => node.appendChild(objToNode(childNode, insideSvg, options)));
    }

    if (options.valueDiffing) {
      if (objNode.value) {
        node.value = objNode.value;
      }

      if (objNode.checked) {
        node.checked = objNode.checked;
      }

      if (objNode.selected) {
        node.selected = objNode.selected;
      }
    }
  }

  return node;
}