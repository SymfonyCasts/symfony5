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
$container.find('button').on('click', function (e) {
  e.preventDefault();
  var $button = jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget);
  jquery__WEBPACK_IMPORTED_MODULE_2___default.a.ajax({
    url: '/comments/10/vote/' + $button.val(),
    method: 'POST'
  }).then(function (data) {
    $container.find('.js-vote-total').text(data.votes);
  });
});

/***/ })

},[["./assets/js/app.js","runtime","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2FwcC5qcyJdLCJuYW1lcyI6WyIkY29udGFpbmVyIiwiJCIsImZpbmQiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIiRidXR0b24iLCJjdXJyZW50VGFyZ2V0IiwiYWpheCIsInVybCIsInZhbCIsIm1ldGhvZCIsInRoZW4iLCJkYXRhIiwidGV4dCIsInZvdGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztBQU9BO0NBR0E7O0FBQ0E7QUFFQTs7OztBQUdBLElBQUlBLFVBQVUsR0FBR0MsNkNBQUMsQ0FBQyxpQkFBRCxDQUFsQjtBQUNBRCxVQUFVLENBQUNFLElBQVgsQ0FBZ0IsUUFBaEIsRUFBMEJDLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDLFVBQVNDLENBQVQsRUFBWTtBQUM5Q0EsR0FBQyxDQUFDQyxjQUFGO0FBQ0EsTUFBSUMsT0FBTyxHQUFHTCw2Q0FBQyxDQUFDRyxDQUFDLENBQUNHLGFBQUgsQ0FBZjtBQUVBTiwrQ0FBQyxDQUFDTyxJQUFGLENBQU87QUFDSEMsT0FBRyxFQUFFLHVCQUFxQkgsT0FBTyxDQUFDSSxHQUFSLEVBRHZCO0FBRUhDLFVBQU0sRUFBRTtBQUZMLEdBQVAsRUFHR0MsSUFISCxDQUdRLFVBQVNDLElBQVQsRUFBZTtBQUNuQmIsY0FBVSxDQUFDRSxJQUFYLENBQWdCLGdCQUFoQixFQUFrQ1ksSUFBbEMsQ0FBdUNELElBQUksQ0FBQ0UsS0FBNUM7QUFDSCxHQUxEO0FBTUgsQ0FWRCxFIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qXG4gKiBXZWxjb21lIHRvIHlvdXIgYXBwJ3MgbWFpbiBKYXZhU2NyaXB0IGZpbGUhXG4gKlxuICogV2UgcmVjb21tZW5kIGluY2x1ZGluZyB0aGUgYnVpbHQgdmVyc2lvbiBvZiB0aGlzIEphdmFTY3JpcHQgZmlsZVxuICogKGFuZCBpdHMgQ1NTIGZpbGUpIGluIHlvdXIgYmFzZSBsYXlvdXQgKGJhc2UuaHRtbC50d2lnKS5cbiAqL1xuXG4vLyBhbnkgQ1NTIHlvdSBpbXBvcnQgd2lsbCBvdXRwdXQgaW50byBhIHNpbmdsZSBjc3MgZmlsZSAoYXBwLmNzcyBpbiB0aGlzIGNhc2UpXG5pbXBvcnQgJy4uL2Nzcy9hcHAuY3NzJztcblxuLy8gTmVlZCBqUXVlcnk/IEluc3RhbGwgaXQgd2l0aCBcInlhcm4gYWRkIGpxdWVyeVwiLCB0aGVuIHVuY29tbWVudCB0byBpbXBvcnQgaXQuXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG4vKipcbiAqIFNpbXBsZSAodWdseSkgY29kZSB0byBoYW5kbGUgdGhlIGNvbW1lbnQgdm90ZSB1cC9kb3duXG4gKi9cbnZhciAkY29udGFpbmVyID0gJCgnLmpzLXZvdGUtYXJyb3dzJyk7XG4kY29udGFpbmVyLmZpbmQoJ2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyICRidXR0b24gPSAkKGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvY29tbWVudHMvMTAvdm90ZS8nKyRidXR0b24udmFsKCksXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgfSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRjb250YWluZXIuZmluZCgnLmpzLXZvdGUtdG90YWwnKS50ZXh0KGRhdGEudm90ZXMpO1xuICAgIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9