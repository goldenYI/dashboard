'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _miniSignals = require('mini-signals');

var _miniSignals2 = _interopRequireDefault(_miniSignals);

var _parseUri = require('parse-uri');

var _parseUri2 = _interopRequireDefault(_parseUri);

var _async = require('./async');

var async = _interopRequireWildcard(_async);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// some constants
var MAX_PROGRESS = 100;
var rgxExtractUrlHash = /(#[\w-]+)?$/;

/**
 * Manages the state and loading of multiple resources to load.
 *
 * @class
 */

var Loader = function () {
    /**
     * @param {string} [baseUrl=''] - The base url for all resources loaded by this loader.
     * @param {number} [concurrency=10] - The number of resources to load concurrently.
     */
    function Loader() {
        var _this = this;

        var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var concurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

        _classCallCheck(this, Loader);

        /**
         * The base url for all resources loaded by this loader.
         *
         * @member {string}
         */
        this.baseUrl = baseUrl;

        /**
         * The progress percent of the loader going through the queue.
         *
         * @member {number}
         */
        this.progress = 0;

        /**
         * Loading state of the loader, true if it is currently loading resources.
         *
         * @member {boolean}
         */
        this.loading = false;

        /**
         * A querystring to append to every URL added to the loader.
         *
         * This should be a valid query string *without* the question-mark (`?`). The loader will
         * also *not* escape values for you. Make sure to escape your parameters with
         * [`encodeURIComponent`](https://mdn.io/encodeURIComponent) before assigning this property.
         *
         * @example
         *
         * ```js
         * const loader = new Loader();
         *
         * loader.defaultQueryString = 'user=me&password=secret';
         *
         * // This will request 'image.png?user=me&password=secret'
         * loader.add('image.png').load();
         *
         * loader.reset();
         *
         * // This will request 'image.png?v=1&user=me&password=secret'
         * loader.add('iamge.png?v=1').load();
         * ```
         */
        this.defaultQueryString = '';

        /**
         * The middleware to run before loading each resource.
         *
         * @member {function[]}
         */
        this._beforeMiddleware = [];

        /**
         * The middleware to run after loading each resource.
         *
         * @member {function[]}
         */
        this._afterMiddleware = [];

        /**
         * The tracks the resources we are currently completing parsing for.
         *
         * @member {Resource[]}
         */
        this._resourcesParsing = [];

        /**
         * The `_loadResource` function bound with this object context.
         *
         * @private
         * @member {function}
         * @param {Resource} r - The resource to load
         * @param {Function} d - The dequeue function
         * @return {undefined}
         */
        this._boundLoadResource = function (r, d) {
            return _this._loadResource(r, d);
        };

        /**
         * The resources waiting to be loaded.
         *
         * @private
         * @member {Resource[]}
         */
        this._queue = async.queue(this._boundLoadResource, concurrency);

        this._queue.pause();

        /**
         * All the resources for this loader keyed by name.
         *
         * @member {object<string, Resource>}
         */
        this.resources = {};

        /**
         * Dispatched once per loaded or errored resource.
         *
         * The callback looks like {@link Loader.OnProgressSignal}.
         *
         * @member {Signal}
         */
        this.onProgress = new _miniSignals2.default();

        /**
         * Dispatched once per errored resource.
         *
         * The callback looks like {@link Loader.OnErrorSignal}.
         *
         * @member {Signal}
         */
        this.onError = new _miniSignals2.default();

        /**
         * Dispatched once per loaded resource.
         *
         * The callback looks like {@link Loader.OnLoadSignal}.
         *
         * @member {Signal}
         */
        this.onLoad = new _miniSignals2.default();

        /**
         * Dispatched when the loader begins to process the queue.
         *
         * The callback looks like {@link Loader.OnStartSignal}.
         *
         * @member {Signal}
         */
        this.onStart = new _miniSignals2.default();

        /**
         * Dispatched when the queued resources all load.
         *
         * The callback looks like {@link Loader.OnCompleteSignal}.
         *
         * @member {Signal}
         */
        this.onComplete = new _miniSignals2.default();

        /**
         * When the progress changes the loader and resource are disaptched.
         *
         * @memberof Loader
         * @callback OnProgressSignal
         * @param {Loader} loader - The loader the progress is advancing on.
         * @param {Resource} resource - The resource that has completed or failed to cause the progress to advance.
         */

        /**
         * When an error occurrs the loader and resource are disaptched.
         *
         * @memberof Loader
         * @callback OnErrorSignal
         * @param {Loader} loader - The loader the error happened in.
         * @param {Resource} resource - The resource that caused the error.
         */

        /**
         * When a load completes the loader and resource are disaptched.
         *
         * @memberof Loader
         * @callback OnLoadSignal
         * @param {Loader} loader - The loader that laoded the resource.
         * @param {Resource} resource - The resource that has completed loading.
         */

        /**
         * When the loader starts loading resources it dispatches this callback.
         *
         * @memberof Loader
         * @callback OnStartSignal
         * @param {Loader} loader - The loader that has started loading resources.
         */

        /**
         * When the loader completes loading resources it dispatches this callback.
         *
         * @memberof Loader
         * @callback OnCompleteSignal
         * @param {Loader} loader - The loader that has finished loading resources.
         */
    }

    /**
     * Adds a resource (or multiple resources) to the loader queue.
     *
     * This function can take a wide variety of different parameters. The only thing that is always
     * required the url to load. All the following will work:
     *
     * ```js
     * loader
     *     // normal param syntax
     *     .add('key', 'http://...', function () {})
     *     .add('http://...', function () {})
     *     .add('http://...')
     *
     *     // object syntax
     *     .add({
     *         name: 'key2',
     *         url: 'http://...'
     *     }, function () {})
     *     .add({
     *         url: 'http://...'
     *     }, function () {})
     *     .add({
     *         name: 'key3',
     *         url: 'http://...'
     *         onComplete: function () {}
     *     })
     *     .add({
     *         url: 'https://...',
     *         onComplete: function () {},
     *         crossOrigin: true
     *     })
     *
     *     // you can also pass an array of objects or urls or both
     *     .add([
     *         { name: 'key4', url: 'http://...', onComplete: function () {} },
     *         { url: 'http://...', onComplete: function () {} },
     *         'http://...'
     *     ])
     *
     *     // and you can use both params and options
     *     .add('key', 'http://...', { crossOrigin: true }, function () {})
     *     .add('http://...', { crossOrigin: true }, function () {});
     * ```
     *
     * @param {string} [name] - The name of the resource to load, if not passed the url is used.
     * @param {string} [url] - The url for this resource, relative to the baseUrl of this loader.
     * @param {object} [options] - The options for the load.
     * @param {boolean} [options.crossOrigin] - Is this request cross-origin? Default is to determine automatically.
     * @param {Resource.LOAD_TYPE} [options.loadType=Resource.LOAD_TYPE.XHR] - How should this resource be loaded?
     * @param {Resource.XHR_RESPONSE_TYPE} [options.xhrType=Resource.XHR_RESPONSE_TYPE.DEFAULT] - How should
     *      the data being loaded be interpreted when using XHR?
     * @param {object} [options.metadata] - Extra configuration for middleware and the Resource object.
     * @param {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [options.metadata.loadElement=null] - The
     *      element to use for loading, instead of creating one.
     * @param {boolean} [options.metadata.skipSource=false] - Skips adding source(s) to the load element. This
     *      is useful if you want to pass in a `loadElement` that you already added load sources to.
     * @param {function} [cb] - Function to call when this specific resource completes loading.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.add = function add(name, url, options, cb) {
        // special case of an array of objects or urls
        if (Array.isArray(name)) {
            for (var i = 0; i < name.length; ++i) {
                this.add(name[i]);
            }

            return this;
        }

        // if an object is passed instead of params
        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
            cb = url || name.callback || name.onComplete;
            options = name;
            url = name.url;
            name = name.name || name.key || name.url;
        }

        // case where no name is passed shift all args over by one.
        if (typeof url !== 'string') {
            cb = options;
            options = url;
            url = name;
        }

        // now that we shifted make sure we have a proper url.
        if (typeof url !== 'string') {
            throw new Error('No url passed to add resource to loader.');
        }

        // options are optional so people might pass a function and no options
        if (typeof options === 'function') {
            cb = options;
            options = null;
        }

        // if loading already you can only add resources that have a parent.
        if (this.loading && (!options || !options.parentResource)) {
            throw new Error('Cannot add resources while the loader is running.');
        }

        // check if resource already exists.
        if (this.resources[name]) {
            throw new Error('Resource named "' + name + '" already exists.');
        }

        // add base url if this isn't an absolute url
        url = this._prepareUrl(url);

        // create the store the resource
        this.resources[name] = new _Resource2.default(name, url, options);

        if (typeof cb === 'function') {
            this.resources[name].onAfterMiddleware.once(cb);
        }

        // if actively loading, make sure to adjust progress chunks for that parent and its children
        if (this.loading) {
            var parent = options.parentResource;
            var incompleteChildren = [];

            for (var _i = 0; _i < parent.children.length; ++_i) {
                if (!parent.children[_i].isComplete) {
                    incompleteChildren.push(parent.children[_i]);
                }
            }

            var fullChunk = parent.progressChunk * (incompleteChildren.length + 1); // +1 for parent
            var eachChunk = fullChunk / (incompleteChildren.length + 2); // +2 for parent & new child

            parent.children.push(this.resources[name]);
            parent.progressChunk = eachChunk;

            for (var _i2 = 0; _i2 < incompleteChildren.length; ++_i2) {
                incompleteChildren[_i2].progressChunk = eachChunk;
            }
        }

        // add the resource to the queue
        this._queue.push(this.resources[name]);

        return this;
    };

    /**
     * Sets up a middleware function that will run *before* the
     * resource is loaded.
     *
     * @method before
     * @param {function} fn - The middleware function to register.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.pre = function pre(fn) {
        this._beforeMiddleware.push(fn);

        return this;
    };

    /**
     * Sets up a middleware function that will run *after* the
     * resource is loaded.
     *
     * @alias use
     * @method after
     * @param {function} fn - The middleware function to register.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.use = function use(fn) {
        this._afterMiddleware.push(fn);

        return this;
    };

    /**
     * Resets the queue of the loader to prepare for a new load.
     *
     * @return {Loader} Returns itself.
     */


    Loader.prototype.reset = function reset() {
        this.progress = 0;
        this.loading = false;

        this._queue.kill();
        this._queue.pause();

        // abort all resource loads
        for (var k in this.resources) {
            var res = this.resources[k];

            if (res._onLoadBinding) {
                res._onLoadBinding.detach();
            }

            if (res.isLoading) {
                res.abort();
            }
        }

        this.resources = {};

        return this;
    };

    /**
     * Starts loading the queued resources.
     *
     * @param {function} [cb] - Optional callback that will be bound to the `complete` event.
     * @return {Loader} Returns itself.
     */


    Loader.prototype.load = function load(cb) {
        // register complete callback if they pass one
        if (typeof cb === 'function') {
            this.onComplete.once(cb);
        }

        // if the queue has already started we are done here
        if (this.loading) {
            return this;
        }

        // distribute progress chunks
        var chunk = 100 / this._queue._tasks.length;

        for (var i = 0; i < this._queue._tasks.length; ++i) {
            this._queue._tasks[i].data.progressChunk = chunk;
        }

        // update loading state
        this.loading = true;

        // notify of start
        this.onStart.dispatch(this);

        // start loading
        this._queue.resume();

        return this;
    };

    /**
     * Prepares a url for usage based on the configuration of this object
     *
     * @private
     * @param {string} url - The url to prepare.
     * @return {string} The prepared url.
     */


    Loader.prototype._prepareUrl = function _prepareUrl(url) {
        var parsedUrl = (0, _parseUri2.default)(url, { strictMode: true });
        var result = void 0;

        // absolute url, just use it as is.
        if (parsedUrl.protocol || !parsedUrl.path || url.indexOf('//') === 0) {
            result = url;
        }
        // if baseUrl doesn't end in slash and url doesn't start with slash, then add a slash inbetween
        else if (this.baseUrl.length && this.baseUrl.lastIndexOf('/') !== this.baseUrl.length - 1 && url.charAt(0) !== '/') {
                result = this.baseUrl + '/' + url;
            } else {
                result = this.baseUrl + url;
            }

        // if we need to add a default querystring, there is a bit more work
        if (this.defaultQueryString) {
            var hash = rgxExtractUrlHash.exec(result)[0];

            result = result.substr(0, result.length - hash.length);

            if (result.indexOf('?') !== -1) {
                result += '&' + this.defaultQueryString;
            } else {
                result += '?' + this.defaultQueryString;
            }

            result += hash;
        }

        return result;
    };

    /**
     * Loads a single resource.
     *
     * @private
     * @param {Resource} resource - The resource to load.
     * @param {function} dequeue - The function to call when we need to dequeue this item.
     */


    Loader.prototype._loadResource = function _loadResource(resource, dequeue) {
        var _this2 = this;

        resource._dequeue = dequeue;

        // run before middleware
        async.eachSeries(this._beforeMiddleware, function (fn, next) {
            fn.call(_this2, resource, function () {
                // if the before middleware marks the resource as complete,
                // break and don't process any more before middleware
                next(resource.isComplete ? {} : null);
            });
        }, function () {
            if (resource.isComplete) {
                _this2._onLoad(resource);
            } else {
                resource._onLoadBinding = resource.onComplete.once(_this2._onLoad, _this2);
                resource.load();
            }
        });
    };

    /**
     * Called once each resource has loaded.
     *
     * @private
     */


    Loader.prototype._onComplete = function _onComplete() {
        this.loading = false;

        this.onComplete.dispatch(this, this.resources);
    };

    /**
     * Called each time a resources is loaded.
     *
     * @private
     * @param {Resource} resource - The resource that was loaded
     */


    Loader.prototype._onLoad = function _onLoad(resource) {
        var _this3 = this;

        resource._onLoadBinding = null;

        // remove this resource from the async queue, and add it to our list of resources that are being parsed
        resource._dequeue();
        this._resourcesParsing.push(resource);

        // run middleware, this *must* happen before dequeue so sub-assets get added properly
        async.eachSeries(this._afterMiddleware, function (fn, next) {
            fn.call(_this3, resource, next);
        }, function () {
            resource.onAfterMiddleware.dispatch(resource);

            _this3.progress += resource.progressChunk;
            _this3.onProgress.dispatch(_this3, resource);

            if (resource.error) {
                _this3.onError.dispatch(resource.error, _this3, resource);
            } else {
                _this3.onLoad.dispatch(_this3, resource);
            }

            _this3._resourcesParsing.splice(_this3._resourcesParsing.indexOf(resource), 1);

            // do completion check
            if (_this3._queue.idle() && _this3._resourcesParsing.length === 0) {
                _this3.progress = MAX_PROGRESS;
                _this3._onComplete();
            }
        });
    };

    return Loader;
}();

exports.default = Loader;
//# sourceMappingURL=Loader.js.map