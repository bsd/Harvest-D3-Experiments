class StorageWorker

    constructor: (context, import_scripts_fn) ->

        # Config and State
        @state =
            log_enabled: false
            connections: 0
            running_tasks: 0
            open_ports: []

        @config =
            do_index: true
            do_count: true
            max_connections: 5
            main_thread_port: null
            log_thread_port: null

        # Define `connect` and `message` entrypoints
        @message = (port, event) =>
            try
              requestor = event.data.client
              method = event.data.method
              params = event.data.params

            catch error
              request = JSON.parse(event.data)
              requestor = request.client
              method = request.method
              params = request.params

            @dispatch(port, requestor, method, params)

        @connect = (event) =>
            @state.connections++
            port = event.ports[0]

            message_callback = () => @message(port, event)
            port.addEventListener "message", message_callback, false
            @state.open_ports.push port
            port.start()


        # Add event listeners
        context.addEventListener "connect", @connect, false


    dispatch: (port, requestor, method, params) ->

        if method == 'register'
            if params.pipe == 'log'
                @config.log_thread_port = port
                @state.log_enabled = true
            else if params.pipe == 'main'
                @config.main_thread_port = port


    response: (port, data) ->
        port.postMessage(data)
        return null

    log: (message) ->
        if @state.log_enabled == true
            log_payload =
                worker: 'Storage'
                message: message
            @response(@config.log_thread_port, log_payload)

StorageThread = new StorageWorker(@, importScripts)