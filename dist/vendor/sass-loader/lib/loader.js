"use strict";

const sass = require("node-sass");
const path = require("path");
const async = require("async");
const formatSassError = require("./formatSassError");
const webpackImporter = require("./webpackImporter");
const normalizeOptions = require("./normalizeOptions");
const pify = require("pify");

// This queue makes sure node-sass leaves one thread available for executing
// fs tasks when running the custom importer code.
// This can be removed as soon as node-sass implements a fix for this.
const threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4;
const asyncSassJobQueue = async.queue(sass.render, threadPoolSize - 1);

/**
 * The sass-loader makes node-sass available to webpack modules.
 *
 * @this {LoaderContext}
 * @param {string} content
 */
function sassLoader(content) {
    const callback = this.async();
    const isSync = typeof callback !== "function";
    const self = this;
    const resourcePath = this.resourcePath;

    function addNormalizedDependency(file) {
        // node-sass returns UNIX-style paths
        self.dependency(path.normalize(file));
    }

    if (isSync) {
        throw new Error("Synchronous compilation is not supported anymore. See https://github.com/jtangelder/sass-loader/issues/333");
    }

    this.cacheable();

    const options = normalizeOptions(this, content, webpackImporter(
        resourcePath,
        pify(this.resolve.bind(this)),
        addNormalizedDependency
    ));

    // start the actual rendering
    asyncSassJobQueue.push(options, (err, result) => {
        if (err) {
            formatSassError(err, this.resourcePath);
            err.file && this.dependency(err.file);
            callback(err);
            return;
        }

        if (result.map && result.map !== "{}") {
            result.map = JSON.parse(result.map);
            result.map.file = resourcePath;
            // The first source is 'stdin' according to libsass because we've used the data input
            // Now let's override that value with the correct relative path
            result.map.sources[0] = path.relative(self.options.context, resourcePath);
            result.map.sourceRoot = path.relative(self.options.context, process.cwd());
        } else {
            result.map = null;
        }

        result.stats.includedFiles.forEach(addNormalizedDependency);
        callback(null, result.css.toString(), result.map);
    });
}

module.exports = sassLoader;