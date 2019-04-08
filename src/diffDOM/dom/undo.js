"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.undoDOM = undoDOM;

var _apply = require("./apply");

// ===== Undo a diff =====
function swap(obj, p1, p2) {
  const tmp = obj[p1];
  obj[p1] = obj[p2];
  obj[p2] = tmp;
}

function undoDiff(tree, diff, options // {preDiffApply, postDiffApply, textDiff, valueDiffing, _const}
) {
  switch (diff[options._const.action]) {
    case options._const.addAttribute:
      diff[options._const.action] = options._const.removeAttribute;
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.modifyAttribute:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.removeAttribute:
      diff[options._const.action] = options._const.addAttribute;
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.modifyTextElement:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.modifyValue:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.modifyComment:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.modifyChecked:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.modifySelected:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.replaceElement:
      swap(diff, options._const.oldValue, options._const.newValue);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.relocateGroup:
      swap(diff, options._const.from, options._const.to);
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.removeElement:
      diff[options._const.action] = options._const.addElement;
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.addElement:
      diff[options._const.action] = options._const.removeElement;
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.removeTextElement:
      diff[options._const.action] = options._const.addTextElement;
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    case options._const.addTextElement:
      diff[options._const.action] = options._const.removeTextElement;
      (0, _apply.applyDiff)(tree, diff, options);
      break;

    default:
      console.log('unknown action');
  }
}

function undoDOM(tree, diffs, options) {
  if (!diffs.length) {
    diffs = [diffs];
  }

  diffs = diffs.slice();
  diffs.reverse();
  diffs.forEach(diff => {
    undoDiff(tree, diff, options);
  });
}