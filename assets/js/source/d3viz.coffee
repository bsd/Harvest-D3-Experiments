class D3App

    constructor: (window, utils) ->

        ## == App/Platform Config & State == ##
        @config =

            # Worker Locations
            @workers =
                csvparser: '/assets/js/static/compiled/csvparser.js'
                render: '/assets/js/static/compiled/render.js'
                storage: '/assets/js/static/compiled/storage.js'


        @state = {}


        ## == Libraries & Utils == ##
        @lib =
            utils: utils or window.utils
            underscore: window._
            backbone: window.Backbone
            modernizr: window.Modernizr
            mustache: window.Mustache


        ## == Channels, for worker communication == ##
        @channels =

            # Enable a channel
            enable: (channel, worker, postMessage) ->

                # assign callbacks
                worker.onerror = channel.error

                if worker?.onmessage? # is it a regular worker?
                    worker.onmessage = channel.message

                else # nope, it's a shared worker
                    worker.port.onmessage = channel.message

                channel.active_worker = worker
                channel.post_callback = postMessage
                channel.enabled = true


            # Storage (powered by Lawnchair)
            storage:
                enabled: false
                registered: false
                ports:
                    log: null
                    error: null
                    main: null

                message: (event) =>
                    console.log('[Storage]: Message received from StorageSharedWorker.', event)

                error: (event) =>
                    console.error('[Storage]: Error encountered with StorageSharedWorker.', event)


            # Render (powered by Mustache & D3)
            render:
                enabled: false
                registered: false
                message: (event) =>
                    console.log('[Render]: Message received from RenderWorker.', event)

                error: (event) =>
                    console.error('[Render]: Error encountered with RenderWorker.', event)


            # CSVParser (powered by D3)
            csvparser:
                enabled: false
                registered: false

                message: (event) =>
                    console.log('[CSVParser]: Message received from CSVParserWorker.', event)

                error: (event) =>
                    console.error('[CSVParser]: Error encountered with CSVParserWorker.', event)

        @internal =

            bootstrap: () =>
                console.log('[APP]: Bootstrap complete. Starting viz engine.')
                @lib.utils.trigger_loading()

            execute_deferred: (deferred_operations) =>
                console.log('[APP]: Executing deferred page functions.')
                for operation in deferred_operations
                    @lib.utils.trigger_loading()
                    console.log('[Deferred]: Executing fn.', operation)
                    operation.callback(operation.args...)
                    @lib.utils.trigger_done()

                @lib.utils.trigger_done()
                @lib.utils.hide_overlay()

                return



        @controls = {}

        @state = {}



window.d3viz = new D3App(window)