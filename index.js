'use strict'

import { constants } from './constants'
import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'

import { Utils } from './utils'

import { Connectors } from './connectors'
import { Providers } from './providers'
import { Modules } from './modules'

let app = express()
let server = http.Server(app)
let io = new SocketIO(server)
let port = process.env.PORT || constants.sockets.port || 3000

const Connector = new Connectors.Serialport({
  // debug: true,
  verbose: true,
  simulatorInjectLineNoise: '50Hz' // 'none' '50Hz' '60Hz'
})

const Signal = new Providers.Signal({io})
const Motion = new Providers.Motion({io})

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port)
})

Connector.start().then(() => {
  const TimeSeries = new Modules.TimeSeries({Signal})
  const FFT = new Modules.FFT({Signal})
  const Topo = new Modules.Topo({Signal})
  const Raw = new Modules.Raw({Signal})
})

Connector.stream((data) => {
  Signal.buffer(data)
  Motion.capture(data)
})
console.log('[INFO] Server start...')

// Connector.stop()
