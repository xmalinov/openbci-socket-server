'use strict'

import { constants } from '../constants'

class RawData {
  constructor ({Raw}) {
    this.raw = Raw
    this.subscribe()
    this.sample = null
  }

  subscribe () {
    this.raw.emitter.on(constants.events.rawSignal, (rawData) => {
      this.sample = rawData
      this.emit()
    })
  }

  emit () {
    this.raw.io.emit(constants.events.rawSignal, this.sample)
  }
}

export { RawData }
