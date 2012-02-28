(function() {
  var D3App;

  D3App = (function() {

    function D3App(window, utils) {
      var _this = this;
      this.config = this.workers = {
        csvparser: '/assets/js/static/compiled/csvparser.js',
        render: '/assets/js/static/compiled/render.js',
        storage: '/assets/js/static/compiled/storage.js'
      };
      this.state = {};
      this.lib = {
        utils: utils || window.utils,
        underscore: window._,
        backbone: window.Backbone,
        modernizr: window.Modernizr,
        mustache: window.Mustache
      };
      this.channels = {
        enable: function(channel, worker, postMessage) {
          worker.onerror = channel.error;
          if ((worker != null ? worker.onmessage : void 0) != null) {
            worker.onmessage = channel.message;
          } else {
            worker.port.onmessage = channel.message;
          }
          channel.active_worker = worker;
          channel.post_callback = postMessage;
          return channel.enabled = true;
        },
        storage: {
          enabled: false,
          registered: false,
          ports: {
            log: null,
            error: null,
            main: null
          },
          message: function(event) {
            return console.log('[Storage]: Message received from StorageSharedWorker.', event);
          },
          error: function(event) {
            return console.error('[Storage]: Error encountered with StorageSharedWorker.', event);
          }
        },
        render: {
          enabled: false,
          registered: false,
          message: function(event) {
            return console.log('[Render]: Message received from RenderWorker.', event);
          },
          error: function(event) {
            return console.error('[Render]: Error encountered with RenderWorker.', event);
          }
        },
        csvparser: {
          enabled: false,
          registered: false,
          message: function(event) {
            return console.log('[CSVParser]: Message received from CSVParserWorker.', event);
          },
          error: function(event) {
            return console.error('[CSVParser]: Error encountered with CSVParserWorker.', event);
          }
        }
      };
      this.internal = {
        bootstrap: function() {
          console.log('[APP]: Bootstrap complete. Starting viz engine.');
          return _this.lib.utils.trigger_loading();
        },
        execute_deferred: function(deferred_operations) {
          var operation, _i, _len;
          console.log('[APP]: Executing deferred page functions.');
          for (_i = 0, _len = deferred_operations.length; _i < _len; _i++) {
            operation = deferred_operations[_i];
            _this.lib.utils.trigger_loading();
            console.log('[Deferred]: Executing fn.', operation);
            operation.callback.apply(operation, operation.args);
            _this.lib.utils.trigger_done();
          }
          _this.lib.utils.trigger_done();
          _this.lib.utils.hide_overlay();
        }
      };
      this.controls = {};
      this.state = {};
    }

    return D3App;

  })();

  window.d3viz = new D3App(window);

}).call(this);
