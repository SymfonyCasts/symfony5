(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app"],{

/***/ "./assets/css/app.css":
/*!****************************!*\
  !*** ./assets/css/app.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.find */ "./node_modules/core-js/modules/es.array.find.js");
/* harmony import */ var core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_app_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/app.css */ "./assets/css/app.css");
/* harmony import */ var _css_app_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_app_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);


/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
 // Need jQuery? Install it with "yarn add jquery", then uncomment to import it.


/**
 * Simple (ugly) code to handle the comment vote up/down
 */

var $container = jquery__WEBPACK_IMPORTED_MODULE_2___default()('.js-vote-arrows');
$container.find('a').on('click', function (e) {
  e.preventDefault();
  var $link = jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget);
  jquery__WEBPACK_IMPORTED_MODULE_2___default.a.ajax({
    url: '/comments/10/vote/' + $link.data('direction'),
    method: 'POST'
  }).then(function (response) {
    $container.find('.js-vote-total').text(response.votes);
  });
});

/***/ })

},[["./assets/js/app.js","runtime","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2FwcC5qcyJdLCJuYW1lcyI6WyIkY29udGFpbmVyIiwiJCIsImZpbmQiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIiRsaW5rIiwiY3VycmVudFRhcmdldCIsImFqYXgiLCJ1cmwiLCJkYXRhIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwidGV4dCIsInZvdGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztBQU9BO0NBR0E7O0FBQ0E7QUFFQTs7OztBQUdBLElBQUlBLFVBQVUsR0FBR0MsNkNBQUMsQ0FBQyxpQkFBRCxDQUFsQjtBQUNBRCxVQUFVLENBQUNFLElBQVgsQ0FBZ0IsR0FBaEIsRUFBcUJDLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLFVBQVNDLENBQVQsRUFBWTtBQUN6Q0EsR0FBQyxDQUFDQyxjQUFGO0FBQ0EsTUFBSUMsS0FBSyxHQUFHTCw2Q0FBQyxDQUFDRyxDQUFDLENBQUNHLGFBQUgsQ0FBYjtBQUVBTiwrQ0FBQyxDQUFDTyxJQUFGLENBQU87QUFDSEMsT0FBRyxFQUFFLHVCQUFxQkgsS0FBSyxDQUFDSSxJQUFOLENBQVcsV0FBWCxDQUR2QjtBQUVIQyxVQUFNLEVBQUU7QUFGTCxHQUFQLEVBR0dDLElBSEgsQ0FHUSxVQUFTQyxRQUFULEVBQW1CO0FBQ3ZCYixjQUFVLENBQUNFLElBQVgsQ0FBZ0IsZ0JBQWhCLEVBQWtDWSxJQUFsQyxDQUF1Q0QsUUFBUSxDQUFDRSxLQUFoRDtBQUNILEdBTEQ7QUFNSCxDQVZELEUiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLypcbiAqIFdlbGNvbWUgdG8geW91ciBhcHAncyBtYWluIEphdmFTY3JpcHQgZmlsZSFcbiAqXG4gKiBXZSByZWNvbW1lbmQgaW5jbHVkaW5nIHRoZSBidWlsdCB2ZXJzaW9uIG9mIHRoaXMgSmF2YVNjcmlwdCBmaWxlXG4gKiAoYW5kIGl0cyBDU1MgZmlsZSkgaW4geW91ciBiYXNlIGxheW91dCAoYmFzZS5odG1sLnR3aWcpLlxuICovXG5cbi8vIGFueSBDU1MgeW91IGltcG9ydCB3aWxsIG91dHB1dCBpbnRvIGEgc2luZ2xlIGNzcyBmaWxlIChhcHAuY3NzIGluIHRoaXMgY2FzZSlcbmltcG9ydCAnLi4vY3NzL2FwcC5jc3MnO1xuXG4vLyBOZWVkIGpRdWVyeT8gSW5zdGFsbCBpdCB3aXRoIFwieWFybiBhZGQganF1ZXJ5XCIsIHRoZW4gdW5jb21tZW50IHRvIGltcG9ydCBpdC5cbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbi8qKlxuICogU2ltcGxlICh1Z2x5KSBjb2RlIHRvIGhhbmRsZSB0aGUgY29tbWVudCB2b3RlIHVwL2Rvd25cbiAqL1xudmFyICRjb250YWluZXIgPSAkKCcuanMtdm90ZS1hcnJvd3MnKTtcbiRjb250YWluZXIuZmluZCgnYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyICRsaW5rID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnL2NvbW1lbnRzLzEwL3ZvdGUvJyskbGluay5kYXRhKCdkaXJlY3Rpb24nKSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRjb250YWluZXIuZmluZCgnLmpzLXZvdGUtdG90YWwnKS50ZXh0KHJlc3BvbnNlLnZvdGVzKTtcbiAgICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==