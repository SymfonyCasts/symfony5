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
  }).then(function (data) {
    $container.find('.js-vote-total').text(data.votes);
  });
});

/***/ })

},[["./assets/js/app.js","runtime","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2FwcC5qcyJdLCJuYW1lcyI6WyIkY29udGFpbmVyIiwiJCIsImZpbmQiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIiRsaW5rIiwiY3VycmVudFRhcmdldCIsImFqYXgiLCJ1cmwiLCJkYXRhIiwibWV0aG9kIiwidGhlbiIsInRleHQiLCJ2b3RlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7QUFPQTtDQUdBOztBQUNBO0FBRUE7Ozs7QUFHQSxJQUFJQSxVQUFVLEdBQUdDLDZDQUFDLENBQUMsaUJBQUQsQ0FBbEI7QUFDQUQsVUFBVSxDQUFDRSxJQUFYLENBQWdCLEdBQWhCLEVBQXFCQyxFQUFyQixDQUF3QixPQUF4QixFQUFpQyxVQUFTQyxDQUFULEVBQVk7QUFDekNBLEdBQUMsQ0FBQ0MsY0FBRjtBQUNBLE1BQUlDLEtBQUssR0FBR0wsNkNBQUMsQ0FBQ0csQ0FBQyxDQUFDRyxhQUFILENBQWI7QUFFQU4sK0NBQUMsQ0FBQ08sSUFBRixDQUFPO0FBQ0hDLE9BQUcsRUFBRSx1QkFBcUJILEtBQUssQ0FBQ0ksSUFBTixDQUFXLFdBQVgsQ0FEdkI7QUFFSEMsVUFBTSxFQUFFO0FBRkwsR0FBUCxFQUdHQyxJQUhILENBR1EsVUFBU0YsSUFBVCxFQUFlO0FBQ25CVixjQUFVLENBQUNFLElBQVgsQ0FBZ0IsZ0JBQWhCLEVBQWtDVyxJQUFsQyxDQUF1Q0gsSUFBSSxDQUFDSSxLQUE1QztBQUNILEdBTEQ7QUFNSCxDQVZELEUiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLypcbiAqIFdlbGNvbWUgdG8geW91ciBhcHAncyBtYWluIEphdmFTY3JpcHQgZmlsZSFcbiAqXG4gKiBXZSByZWNvbW1lbmQgaW5jbHVkaW5nIHRoZSBidWlsdCB2ZXJzaW9uIG9mIHRoaXMgSmF2YVNjcmlwdCBmaWxlXG4gKiAoYW5kIGl0cyBDU1MgZmlsZSkgaW4geW91ciBiYXNlIGxheW91dCAoYmFzZS5odG1sLnR3aWcpLlxuICovXG5cbi8vIGFueSBDU1MgeW91IGltcG9ydCB3aWxsIG91dHB1dCBpbnRvIGEgc2luZ2xlIGNzcyBmaWxlIChhcHAuY3NzIGluIHRoaXMgY2FzZSlcbmltcG9ydCAnLi4vY3NzL2FwcC5jc3MnO1xuXG4vLyBOZWVkIGpRdWVyeT8gSW5zdGFsbCBpdCB3aXRoIFwieWFybiBhZGQganF1ZXJ5XCIsIHRoZW4gdW5jb21tZW50IHRvIGltcG9ydCBpdC5cbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbi8qKlxuICogU2ltcGxlICh1Z2x5KSBjb2RlIHRvIGhhbmRsZSB0aGUgY29tbWVudCB2b3RlIHVwL2Rvd25cbiAqL1xudmFyICRjb250YWluZXIgPSAkKCcuanMtdm90ZS1hcnJvd3MnKTtcbiRjb250YWluZXIuZmluZCgnYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyICRsaW5rID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnL2NvbW1lbnRzLzEwL3ZvdGUvJyskbGluay5kYXRhKCdkaXJlY3Rpb24nKSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuanMtdm90ZS10b3RhbCcpLnRleHQoZGF0YS52b3Rlcyk7XG4gICAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=