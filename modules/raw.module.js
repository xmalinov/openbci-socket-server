'use strict'

import { constants } from '../constants'

class Raw {
  constructor ({Signal}) {
    this.signal = Signal
    this.rawData = []
    this.subscribe()
  }

  subscribe () {
    this.signal.emitter.on(constants.events.signal, (signals) => {
      this.rawData = signals
      this.emit()
    })
  }

  emit () {
    this.signal.io.emit(constants.events.raw, {
      data: this.rawData
    })
  }
}

export { Raw }
