"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/worker/dashboard/route";
exports.ids = ["app/api/worker/dashboard/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "./action-async-storage.external?8dda":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "./request-async-storage.external?3d59":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "./static-generation-async-storage.external?16bc":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fworker%2Fdashboard%2Froute&page=%2Fapi%2Fworker%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fworker%2Fdashboard%2Froute.ts&appDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fworker%2Fdashboard%2Froute&page=%2Fapi%2Fworker%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fworker%2Fdashboard%2Froute.ts&appDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_lbans_Downloads_laborlink_full_starter_app_api_worker_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/worker/dashboard/route.ts */ \"(rsc)/./app/api/worker/dashboard/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/worker/dashboard/route\",\n        pathname: \"/api/worker/dashboard\",\n        filename: \"route\",\n        bundlePath: \"app/api/worker/dashboard/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\lbans\\\\Downloads\\\\laborlink-full-starter\\\\app\\\\api\\\\worker\\\\dashboard\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_lbans_Downloads_laborlink_full_starter_app_api_worker_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/worker/dashboard/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ3b3JrZXIlMkZkYXNoYm9hcmQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRndvcmtlciUyRmRhc2hib2FyZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRndvcmtlciUyRmRhc2hib2FyZCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNsYmFucyU1Q0Rvd25sb2FkcyU1Q2xhYm9ybGluay1mdWxsLXN0YXJ0ZXIlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2xiYW5zJTVDRG93bmxvYWRzJTVDbGFib3JsaW5rLWZ1bGwtc3RhcnRlciZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDMEM7QUFDdkg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYWJvcmxpbmstZnVsbC8/YjllNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxsYmFuc1xcXFxEb3dubG9hZHNcXFxcbGFib3JsaW5rLWZ1bGwtc3RhcnRlclxcXFxhcHBcXFxcYXBpXFxcXHdvcmtlclxcXFxkYXNoYm9hcmRcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3dvcmtlci9kYXNoYm9hcmQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS93b3JrZXIvZGFzaGJvYXJkXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS93b3JrZXIvZGFzaGJvYXJkL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcbGJhbnNcXFxcRG93bmxvYWRzXFxcXGxhYm9ybGluay1mdWxsLXN0YXJ0ZXJcXFxcYXBwXFxcXGFwaVxcXFx3b3JrZXJcXFxcZGFzaGJvYXJkXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS93b3JrZXIvZGFzaGJvYXJkL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fworker%2Fdashboard%2Froute&page=%2Fapi%2Fworker%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fworker%2Fdashboard%2Froute.ts&appDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/worker/dashboard/route.ts":
/*!*******************************************!*\
  !*** ./app/api/worker/dashboard/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth_options__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth-options */ \"(rsc)/./lib/auth-options.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\n\nasync function GET() {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth_options__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session?.user?.email) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"You must be signed in.\"\n            }, {\n                status: 401\n            });\n        }\n        const email = session.user.email.trim().toLowerCase();\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n            where: {\n                email\n            },\n            include: {\n                workerProfile: true,\n                applications: {\n                    orderBy: {\n                        createdAt: \"desc\"\n                    },\n                    include: {\n                        job: {\n                            include: {\n                                hirer: {\n                                    select: {\n                                        id: true,\n                                        name: true,\n                                        image: true\n                                    }\n                                },\n                                booking: {\n                                    select: {\n                                        id: true,\n                                        status: true,\n                                        agreedAmount: true,\n                                        acceptedAt: true,\n                                        startedAt: true,\n                                        completedAt: true,\n                                        paidAt: true\n                                    }\n                                }\n                            }\n                        }\n                    }\n                },\n                bookings: {\n                    orderBy: {\n                        createdAt: \"desc\"\n                    },\n                    include: {\n                        job: {\n                            include: {\n                                hirer: {\n                                    select: {\n                                        id: true,\n                                        name: true,\n                                        image: true\n                                    }\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        });\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                currentUserId: null,\n                profile: null,\n                applications: [],\n                bookings: []\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            currentUserId: user.id,\n            profile: user.workerProfile ? {\n                ...user.workerProfile,\n                name: user.name,\n                email: user.email,\n                image: user.image\n            } : null,\n            applications: user.applications,\n            bookings: user.bookings\n        });\n    } catch (error) {\n        console.error(\"GET /api/worker/dashboard error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error:  true && error instanceof Error ? error.message : \"Unable to load worker dashboard.\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3dvcmtlci9kYXNoYm9hcmQvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTJDO0FBQ0U7QUFFSTtBQUNYO0FBRS9CLGVBQWVJO0lBQ3BCLElBQUk7UUFDRixNQUFNQyxVQUFVLE1BQU1KLDJEQUFnQkEsQ0FBQ0MsMERBQVdBO1FBRWxELElBQUksQ0FBQ0csU0FBU0MsTUFBTUMsT0FBTztZQUN6QixPQUFPUCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtnQkFDRUMsT0FBTztZQUNULEdBQ0E7Z0JBQ0VDLFFBQVE7WUFDVjtRQUVKO1FBRUEsTUFBTUgsUUFBUUYsUUFBUUMsSUFBSSxDQUFDQyxLQUFLLENBQUNJLElBQUksR0FBR0MsV0FBVztRQUVuRCxNQUFNTixPQUFPLE1BQU1ILCtDQUFNQSxDQUFDRyxJQUFJLENBQUNPLFVBQVUsQ0FBQztZQUN4Q0MsT0FBTztnQkFDTFA7WUFDRjtZQUNBUSxTQUFTO2dCQUNQQyxlQUFlO2dCQUNmQyxjQUFjO29CQUNaQyxTQUFTO3dCQUNQQyxXQUFXO29CQUNiO29CQUNBSixTQUFTO3dCQUNQSyxLQUFLOzRCQUNITCxTQUFTO2dDQUNQTSxPQUFPO29DQUNMQyxRQUFRO3dDQUNOQyxJQUFJO3dDQUNKQyxNQUFNO3dDQUNOQyxPQUFPO29DQUNUO2dDQUNGO2dDQUNBQyxTQUFTO29DQUNQSixRQUFRO3dDQUNOQyxJQUFJO3dDQUNKYixRQUFRO3dDQUNSaUIsY0FBYzt3Q0FDZEMsWUFBWTt3Q0FDWkMsV0FBVzt3Q0FDWEMsYUFBYTt3Q0FDYkMsUUFBUTtvQ0FDVjtnQ0FDRjs0QkFDRjt3QkFDRjtvQkFDRjtnQkFDRjtnQkFDQUMsVUFBVTtvQkFDUmQsU0FBUzt3QkFDUEMsV0FBVztvQkFDYjtvQkFDQUosU0FBUzt3QkFDUEssS0FBSzs0QkFDSEwsU0FBUztnQ0FDUE0sT0FBTztvQ0FDTEMsUUFBUTt3Q0FDTkMsSUFBSTt3Q0FDSkMsTUFBTTt3Q0FDTkMsT0FBTztvQ0FDVDtnQ0FDRjs0QkFDRjt3QkFDRjtvQkFDRjtnQkFDRjtZQUNGO1FBQ0Y7UUFFQSxJQUFJLENBQUNuQixNQUFNO1lBQ1QsT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FBQztnQkFDdkJ5QixlQUFlO2dCQUNmQyxTQUFTO2dCQUNUakIsY0FBYyxFQUFFO2dCQUNoQmUsVUFBVSxFQUFFO1lBQ2Q7UUFDRjtRQUVBLE9BQU9oQyxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQ3ZCeUIsZUFBZTNCLEtBQUtpQixFQUFFO1lBRXRCVyxTQUFTNUIsS0FBS1UsYUFBYSxHQUN2QjtnQkFDRSxHQUFHVixLQUFLVSxhQUFhO2dCQUNyQlEsTUFBTWxCLEtBQUtrQixJQUFJO2dCQUNmakIsT0FBT0QsS0FBS0MsS0FBSztnQkFDakJrQixPQUFPbkIsS0FBS21CLEtBQUs7WUFDbkIsSUFDQTtZQUVKUixjQUFjWCxLQUFLVyxZQUFZO1lBRS9CZSxVQUFVMUIsS0FBSzBCLFFBQVE7UUFDekI7SUFDRixFQUFFLE9BQU92QixPQUFPO1FBQ2QwQixRQUFRMUIsS0FBSyxDQUFDLG9DQUFvQ0E7UUFFbEQsT0FBT1QscURBQVlBLENBQUNRLElBQUksQ0FDdEI7WUFDRUMsT0FDRTJCLEtBQXlCLElBQ3pCM0IsaUJBQWlCNEIsUUFDYjVCLE1BQU02QixPQUFPLEdBQ2I7UUFDUixHQUNBO1lBQ0U1QixRQUFRO1FBQ1Y7SUFFSjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGFib3JsaW5rLWZ1bGwvLi9hcHAvYXBpL3dvcmtlci9kYXNoYm9hcmQvcm91dGUudHM/YmMwYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnO1xyXG5cclxuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoLW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xyXG5cclxuICAgIGlmICghc2Vzc2lvbj8udXNlcj8uZW1haWwpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGVycm9yOiAnWW91IG11c3QgYmUgc2lnbmVkIGluLicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzdGF0dXM6IDQwMSxcclxuICAgICAgICB9LFxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVtYWlsID0gc2Vzc2lvbi51c2VyLmVtYWlsLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICBlbWFpbCxcclxuICAgICAgfSxcclxuICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgIHdvcmtlclByb2ZpbGU6IHRydWUsXHJcbiAgICAgICAgYXBwbGljYXRpb25zOiB7XHJcbiAgICAgICAgICBvcmRlckJ5OiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogJ2Rlc2MnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgam9iOiB7XHJcbiAgICAgICAgICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgICAgICAgICAgaGlyZXI6IHtcclxuICAgICAgICAgICAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib29raW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhZ3JlZWRBbW91bnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0ZWRBdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGVkQXQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkQXQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFpZEF0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb2tpbmdzOiB7XHJcbiAgICAgICAgICBvcmRlckJ5OiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogJ2Rlc2MnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgam9iOiB7XHJcbiAgICAgICAgICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgICAgICAgICAgaGlyZXI6IHtcclxuICAgICAgICAgICAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xyXG4gICAgICAgIGN1cnJlbnRVc2VySWQ6IG51bGwsXHJcbiAgICAgICAgcHJvZmlsZTogbnVsbCxcclxuICAgICAgICBhcHBsaWNhdGlvbnM6IFtdLFxyXG4gICAgICAgIGJvb2tpbmdzOiBbXSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgY3VycmVudFVzZXJJZDogdXNlci5pZCxcclxuXHJcbiAgICAgIHByb2ZpbGU6IHVzZXIud29ya2VyUHJvZmlsZVxyXG4gICAgICAgID8ge1xyXG4gICAgICAgICAgICAuLi51c2VyLndvcmtlclByb2ZpbGUsXHJcbiAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcclxuICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIGltYWdlOiB1c2VyLmltYWdlLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDogbnVsbCxcclxuXHJcbiAgICAgIGFwcGxpY2F0aW9uczogdXNlci5hcHBsaWNhdGlvbnMsXHJcblxyXG4gICAgICBib29raW5nczogdXNlci5ib29raW5ncyxcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdHRVQgL2FwaS93b3JrZXIvZGFzaGJvYXJkIGVycm9yOicsIGVycm9yKTtcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHtcclxuICAgICAgICBlcnJvcjpcclxuICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEVycm9yXHJcbiAgICAgICAgICAgID8gZXJyb3IubWVzc2FnZVxyXG4gICAgICAgICAgICA6ICdVbmFibGUgdG8gbG9hZCB3b3JrZXIgZGFzaGJvYXJkLicsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzdGF0dXM6IDUwMCxcclxuICAgICAgfSxcclxuICAgICk7XHJcbiAgfVxyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsInByaXNtYSIsIkdFVCIsInNlc3Npb24iLCJ1c2VyIiwiZW1haWwiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJ0cmltIiwidG9Mb3dlckNhc2UiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpbmNsdWRlIiwid29ya2VyUHJvZmlsZSIsImFwcGxpY2F0aW9ucyIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJqb2IiLCJoaXJlciIsInNlbGVjdCIsImlkIiwibmFtZSIsImltYWdlIiwiYm9va2luZyIsImFncmVlZEFtb3VudCIsImFjY2VwdGVkQXQiLCJzdGFydGVkQXQiLCJjb21wbGV0ZWRBdCIsInBhaWRBdCIsImJvb2tpbmdzIiwiY3VycmVudFVzZXJJZCIsInByb2ZpbGUiLCJjb25zb2xlIiwicHJvY2VzcyIsIkVycm9yIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/worker/dashboard/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth-options.ts":
/*!*****************************!*\
  !*** ./lib/auth-options.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/v3/types.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\n\nconst loginSchema = zod__WEBPACK_IMPORTED_MODULE_3__.object({\n    email: zod__WEBPACK_IMPORTED_MODULE_3__.string().trim().email(),\n    password: zod__WEBPACK_IMPORTED_MODULE_3__.string().min(1)\n});\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Email and Password\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\",\n                    placeholder: \"you@example.com\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                const parsed = loginSchema.safeParse(credentials);\n                if (!parsed.success) {\n                    return null;\n                }\n                const email = parsed.data.email.toLowerCase();\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        email\n                    },\n                    select: {\n                        id: true,\n                        name: true,\n                        email: true,\n                        image: true,\n                        role: true,\n                        passwordHash: true\n                    }\n                });\n                if (!user?.passwordHash) {\n                    return null;\n                }\n                const passwordMatches = await bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(parsed.data.password, user.passwordHash);\n                if (!passwordMatches) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    image: user.image,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    pages: {\n        signIn: \"/signin\"\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.id = String(token.id);\n                session.user.role = String(token.role);\n            }\n            return session;\n        }\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC1vcHRpb25zLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE4QjtBQUVvQztBQUMxQztBQUVjO0FBRXRDLE1BQU1JLGNBQWNGLHVDQUFRLENBQUM7SUFDM0JJLE9BQU9KLHVDQUFRLEdBQUdNLElBQUksR0FBR0YsS0FBSztJQUM5QkcsVUFBVVAsdUNBQVEsR0FBR1EsR0FBRyxDQUFDO0FBQzNCO0FBRU8sTUFBTUMsY0FBK0I7SUFDMUNDLFdBQVc7UUFDVFgsMkVBQW1CQSxDQUFDO1lBQ2xCWSxNQUFNO1lBRU5DLGFBQWE7Z0JBQ1hSLE9BQU87b0JBQ0xTLE9BQU87b0JBQ1BDLE1BQU07b0JBQ05DLGFBQWE7Z0JBQ2Y7Z0JBQ0FSLFVBQVU7b0JBQ1JNLE9BQU87b0JBQ1BDLE1BQU07Z0JBQ1I7WUFDRjtZQUVBLE1BQU1FLFdBQVVKLFdBQVc7Z0JBQ3pCLE1BQU1LLFNBQVNmLFlBQVlnQixTQUFTLENBQUNOO2dCQUVyQyxJQUFJLENBQUNLLE9BQU9FLE9BQU8sRUFBRTtvQkFDbkIsT0FBTztnQkFDVDtnQkFFQSxNQUFNZixRQUFRYSxPQUFPRyxJQUFJLENBQUNoQixLQUFLLENBQUNpQixXQUFXO2dCQUUzQyxNQUFNQyxPQUFPLE1BQU1yQiwrQ0FBTUEsQ0FBQ3FCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO29CQUN4Q0MsT0FBTzt3QkFDTHBCO29CQUNGO29CQUNBcUIsUUFBUTt3QkFDTkMsSUFBSTt3QkFDSmYsTUFBTTt3QkFDTlAsT0FBTzt3QkFDUHVCLE9BQU87d0JBQ1BDLE1BQU07d0JBQ05DLGNBQWM7b0JBQ2hCO2dCQUNGO2dCQUVBLElBQUksQ0FBQ1AsTUFBTU8sY0FBYztvQkFDdkIsT0FBTztnQkFDVDtnQkFFQSxNQUFNQyxrQkFBa0IsTUFBTWhDLHVEQUFjLENBQzFDbUIsT0FBT0csSUFBSSxDQUFDYixRQUFRLEVBQ3BCZSxLQUFLTyxZQUFZO2dCQUduQixJQUFJLENBQUNDLGlCQUFpQjtvQkFDcEIsT0FBTztnQkFDVDtnQkFFQSxPQUFPO29CQUNMSixJQUFJSixLQUFLSSxFQUFFO29CQUNYZixNQUFNVyxLQUFLWCxJQUFJO29CQUNmUCxPQUFPa0IsS0FBS2xCLEtBQUs7b0JBQ2pCdUIsT0FBT0wsS0FBS0ssS0FBSztvQkFDakJDLE1BQU1OLEtBQUtNLElBQUk7Z0JBQ2pCO1lBQ0Y7UUFDRjtLQUNEO0lBRURJLFNBQVM7UUFDUEMsVUFBVTtJQUNaO0lBRUFDLE9BQU87UUFDTEMsUUFBUTtJQUNWO0lBRUFDLFdBQVc7UUFDVCxNQUFNQyxLQUFJLEVBQUVDLEtBQUssRUFBRWhCLElBQUksRUFBRTtZQUN2QixJQUFJQSxNQUFNO2dCQUNSZ0IsTUFBTVosRUFBRSxHQUFHSixLQUFLSSxFQUFFO2dCQUNsQlksTUFBTVYsSUFBSSxHQUFHLEtBQTRCQSxJQUFJO1lBQy9DO1lBRUEsT0FBT1U7UUFDVDtRQUVBLE1BQU1OLFNBQVEsRUFBRUEsT0FBTyxFQUFFTSxLQUFLLEVBQUU7WUFDOUIsSUFBSU4sUUFBUVYsSUFBSSxFQUFFO2dCQUNoQlUsUUFBUVYsSUFBSSxDQUFDSSxFQUFFLEdBQUdhLE9BQU9ELE1BQU1aLEVBQUU7Z0JBQ2pDTSxRQUFRVixJQUFJLENBQUNNLElBQUksR0FBR1csT0FBT0QsTUFBTVYsSUFBSTtZQUl2QztZQUVBLE9BQU9JO1FBQ1Q7SUFDRjtJQUVBUSxRQUFRQyxRQUFRQyxHQUFHLENBQUNDLGVBQWU7QUFDckMsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2xhYm9ybGluay1mdWxsLy4vbGliL2F1dGgtb3B0aW9ucy50cz9hYTcxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuaW1wb3J0IHR5cGUgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFscyc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJztcblxuY29uc3QgbG9naW5TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGVtYWlsOiB6LnN0cmluZygpLnRyaW0oKS5lbWFpbCgpLFxuICBwYXNzd29yZDogei5zdHJpbmcoKS5taW4oMSksXG59KTtcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogJ0VtYWlsIGFuZCBQYXNzd29yZCcsXG5cbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgbGFiZWw6ICdFbWFpbCcsXG4gICAgICAgICAgdHlwZTogJ2VtYWlsJyxcbiAgICAgICAgICBwbGFjZWhvbGRlcjogJ3lvdUBleGFtcGxlLmNvbScsXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7XG4gICAgICAgICAgbGFiZWw6ICdQYXNzd29yZCcsXG4gICAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBsb2dpblNjaGVtYS5zYWZlUGFyc2UoY3JlZGVudGlhbHMpO1xuXG4gICAgICAgIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVtYWlsID0gcGFyc2VkLmRhdGEuZW1haWwudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgICBpZDogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6IHRydWUsXG4gICAgICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgICAgIGltYWdlOiB0cnVlLFxuICAgICAgICAgICAgcm9sZTogdHJ1ZSxcbiAgICAgICAgICAgIHBhc3N3b3JkSGFzaDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXVzZXI/LnBhc3N3b3JkSGFzaCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFzc3dvcmRNYXRjaGVzID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXG4gICAgICAgICAgcGFyc2VkLmRhdGEucGFzc3dvcmQsXG4gICAgICAgICAgdXNlci5wYXNzd29yZEhhc2gsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFwYXNzd29yZE1hdGNoZXMpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIGltYWdlOiB1c2VyLmltYWdlLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiAnand0JyxcbiAgfSxcblxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9zaWduaW4nLFxuICB9LFxuXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4ucm9sZSA9ICh1c2VyIGFzIHsgcm9sZT86IHN0cmluZyB9KS5yb2xlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSxcblxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAoc2Vzc2lvbi51c2VyKSB7XG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IFN0cmluZyh0b2tlbi5pZCk7XG4gICAgICAgIHNlc3Npb24udXNlci5yb2xlID0gU3RyaW5nKHRva2VuLnJvbGUpIGFzXG4gICAgICAgICAgfCAnSElSRVInXG4gICAgICAgICAgfCAnV09SS0VSJ1xuICAgICAgICAgIHwgJ0FETUlOJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfSxcbiAgfSxcblxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07Il0sIm5hbWVzIjpbImJjcnlwdCIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJ6IiwicHJpc21hIiwibG9naW5TY2hlbWEiLCJvYmplY3QiLCJlbWFpbCIsInN0cmluZyIsInRyaW0iLCJwYXNzd29yZCIsIm1pbiIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwibGFiZWwiLCJ0eXBlIiwicGxhY2Vob2xkZXIiLCJhdXRob3JpemUiLCJwYXJzZWQiLCJzYWZlUGFyc2UiLCJzdWNjZXNzIiwiZGF0YSIsInRvTG93ZXJDYXNlIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsInNlbGVjdCIsImlkIiwiaW1hZ2UiLCJyb2xlIiwicGFzc3dvcmRIYXNoIiwicGFzc3dvcmRNYXRjaGVzIiwiY29tcGFyZSIsInNlc3Npb24iLCJzdHJhdGVneSIsInBhZ2VzIiwic2lnbkluIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJTdHJpbmciLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth-options.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUNFQyxLQUFzQyxHQUNsQztRQUFDO1FBQVM7UUFBUztLQUFPLEdBQzFCLENBQVM7QUFDakIsR0FBRztBQUVMLElBQUlBLElBQXFDLEVBQUU7SUFDekNKLGdCQUFnQkUsTUFBTSxHQUFHQTtBQUMzQiIsInNvdXJjZXMiOlsid2VicGFjazovL2xhYm9ybGluay1mdWxsLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMge1xuICBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzpcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCJcbiAgICAgICAgPyBbXCJxdWVyeVwiLCBcImVycm9yXCIsIFwid2FyblwiXVxuICAgICAgICA6IFtcImVycm9yXCJdLFxuICB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xufSJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/zod","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fworker%2Fdashboard%2Froute&page=%2Fapi%2Fworker%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fworker%2Fdashboard%2Froute.ts&appDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clbans%5CDownloads%5Claborlink-full-starter&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();