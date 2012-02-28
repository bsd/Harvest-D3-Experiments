(function() {
  var StorageThread, StorageWorker;

  StorageWorker = (function() {

    function StorageWorker(context, import_scripts_fn) {
      var _this = this;
      this.state = {
        log_enabled: false,
        connections: 0,
        running_tasks: 0,
        open_ports: []
      };
      this.config = {
        do_index: true,
        do_count: true,
        max_connections: 5,
        main_thread_port: null,
        log_thread_port: null
      };
      this.message = function(port, event) {
        var method, params, request, requestor;
        try {
          requestor = event.data.client;
          method = event.data.method;
          params = event.data.params;
        } catch (error) {
          request = JSON.parse(event.data);
          requestor = request.client;
          method = request.method;
          params = request.params;
        }
        return _this.dispatch(port, requestor, method, params);
      };
      this.connect = function(event) {
        var message_callback, port;
        _this.state.connections++;
        port = event.ports[0];
        message_callback = function() {
          return _this.message(port, event);
        };
        port.addEventListener("message", message_callback, false);
        _this.state.open_ports.push(port);
        return port.start();
      };
      context.addEventListener("connect", this.connect, false);
    }

    StorageWorker.prototype.dispatch = function(port, requestor, method, params) {
      if (method === 'register') {
        if (params.pipe === 'log') {
          this.config.log_thread_port = port;
          return this.state.log_enabled = true;
        } else if (params.pipe === 'main') {
          return this.config.main_thread_port = port;
        }
      }
    };

    StorageWorker.prototype.response = function(port, data) {
      port.postMessage(data);
      return null;
    };

    StorageWorker.prototype.log = function(message) {
      var log_payload;
      if (this.state.log_enabled === true) {
        log_payload = {
          worker: 'Storage',
          message: message
        };
        return this.response(this.config.log_thread_port, log_payload);
      }
    };

    return StorageWorker;

  })();

  StorageThread = new StorageWorker(this, importScripts);

}).call(this);
