'use strict'

import { constants } from '../constants'

const signal = {
  voltsToMicrovolts (volts, log) {
    if (!Array.isArray(volts)) {
      volts = [volts]
    }
    return volts.map((volt) => {
      return log ? Math.log10(Math.pow(10, 6) * volt) : Math.pow(10, 6) * volt
    })
  },

  offsetForGrid (amplitude, channelNumber, channelAmount = 8, scale = 1.5) {
    let scaledAmplitude = amplitude * Math.pow(10, scale)
    let offset = 2 * (channelAmount - channelNumber) - 1
    return parseFloat(scaledAmplitude + offset)
  },

  isSimulated (flag = 'simulate') {
    return flag === constants.connector.simulateFlag
  }
}

export { signal }
