'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var By = /** @class */ (function () {
  function By() {}
  By.dataQa = function (dataQa, tag) {
    if (tag === void 0) {
      tag = '';
    }
    return tag + '[data-qa="' + dataQa + '"]';
  };
  By.dataState = function (dataState) {
    return '[data-state="' + dataState + '"]';
  };
  return By;
})();
exports.By = By;
