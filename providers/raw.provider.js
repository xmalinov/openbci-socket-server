'use strict'

import { EventEmitter } from 'events'

import { constants } from '../constants'

class RawSignalEmitter extends EventEmitter {}

class Raw {
  constructor ({io}) {
    this.io = io
    this.rawData = null
    this.count = 0
    this.emitter = new RawSignalEmitter()
  }

  capture (rawData) {
    this.rawData = rawData
    this.emit()
  }

  emit () {
    this.io.emit(constants.events.rawSignal, this.rawData)
  }
}

export { Raw }
