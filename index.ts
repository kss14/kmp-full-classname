export module Kmp_Tools {
    "use strict";

    interface IProcessResult {
        fnFound: boolean;
        path: Array<string>;
    }

    export interface INameResolver {
        getFullClassNameFromInstance(instance: any, global: any): string;
    }

    export class NameResolver implements INameResolver {
        private _fn: any;
        private _global: any;
        //@ts-ignore
        private _processed: Array<any>;

        /**
         To handle recursiveness in the object graph, collect all handled nodes in the object graph,
         so an object is only traversed once.
         */
        isProcessed(obj: any): boolean {
            let  result = false;
            //@ts-ignore
            for (let i, length; i < length; i += 1) {
                //@ts-ignore
                if (this._processed[i] === obj) {
                    return true;
                }
            }
            return result;
        }

        processProperty(obj: any, key: string, path: Array<string>): IProcessResult {
            var result: IProcessResult = {
                fnFound: false,
                path: path
            }

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
                } catch (error) {
                    // Access to some properties result in exceptions.
                }
            }


            return result;
        }

        processObject(obj: any, path: Array<string>): IProcessResult {
            const result: IProcessResult = {
                fnFound: false,
                path: path
            }

            if (this.isProcessed(obj)) {
                return result;
            }
            this._processed.push(obj);
            let processResult= result;
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

        getFullClassNameFromInstance(instance: any, global: any): string {
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
}