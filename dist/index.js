"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KmpTools = void 0;
var KmpTools;
(function (KmpTools) {
    "use strict";
    class NameResolver {
        constructor() {
        }
        /**
         To handle recursiveness in the object graph, collect all handled nodes in the object graph,
         so an object is only traversed once.
         */
        isProcessed(obj) {
            let result = false;
            const length = this._processed.length;
            for (let i = 0; i < length; i += 1) {
                if (this._processed[i] === obj) {
                    return result = true;
                }
            }
            return result;
        }
        processProperty(obj, key, path) {
            var result = {
                fnFound: false,
                path: path
            };
            if (obj.hasOwnProperty(key)) {
                try {
                    var prop = obj[key];
                    if (prop === this._fn) {
                        // Function found, stop traversing the object graph.
                        result.fnFound = true;
                        return result;
                    }
                    // Continue traversing the object graph.
                    result = this.processObject(prop, path);
                    if (result.fnFound) {
                        // Function found, stop traversing the object graph.
                        return result;
                    }
                }
                catch (error) {
                    // Access to some properties result in exceptions.
                }
            }
            return result;
        }
        processObject(obj, path) {
            let processResult = {
                fnFound: false,
                path: path
            };
            if (this.isProcessed(obj)) {
                return processResult;
            }
            this._processed.push(obj);
            for (const key in obj) {
                let pathCopy = path.slice();
                pathCopy.push(key);
                processResult = this.processProperty(obj, key, pathCopy);
                if (processResult.fnFound) {
                    return processResult;
                }
            }
            return processResult;
        }
        getFullClassNameFromInstance(instance, global) {
            this._fn = instance["constructor"];
            this._global = global;
            this._processed = [];
            const processResult = this.processObject(this._global, []);
            let fullFnName = "";
            if (processResult.fnFound) {
                fullFnName = processResult.path.join(".");
            }
            if (fullFnName.split(/^process\.mainModule\..*\.exports\./).length <= 1) {
                return fullFnName.split(".exports.")[1];
            }
            throw new Error('You cannot use "exports" as a class or namespace name.');
        }
    }
    KmpTools.NameResolver = NameResolver;
})(KmpTools = exports.KmpTools || (exports.KmpTools = {}));
