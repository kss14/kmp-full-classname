"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kmp_Tools = void 0;
var Kmp_Tools;
(function (Kmp_Tools) {
    "use strict";
    class NameResolver {
        /**
         To handle recursiveness in the object graph, collect all handled nodes in the object graph,
         so an object is only traversed once.
         */
        isProcessed(obj) {
            let result = false;
            //@ts-ignore
            for (let i, length; i < length; i += 1) {
                //@ts-ignore
                if (this._processed[i] === obj) {
                    return true;
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
            const result = {
                fnFound: false,
                path: path
            };
            if (this.isProcessed(obj)) {
                return result;
            }
            this._processed.push(obj);
            let processResult = result;
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
            var processResult = this.processObject(this._global, []);
            var fullFnName = "";
            if (processResult.fnFound) {
                fullFnName = processResult.path.join(".");
            }
            return fullFnName;
        }
    }
    Kmp_Tools.NameResolver = NameResolver;
})(Kmp_Tools = exports.Kmp_Tools || (exports.Kmp_Tools = {}));
