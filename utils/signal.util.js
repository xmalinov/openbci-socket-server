'use strict'

import { constants } from '../constants'

const signal = {
  voltsToMicrovolts (volts, log) {
    const cloneVolts = !Array.isArray(volts)
      ? [volts]
      : volts

    return cloneVolts.map((volt) => {
      return log
        ? Math.log10(Math.pow(10, 6) * volt)
        : Math.pow(10, 6) * volt
    })
  },

  offsetForGrid (amplitude, channelNumber, channelAmount = 8, scale = 1.5) {
    const scaledAmplitude = amplitude * Math.pow(10, scale)
    const offset = 2 * (channelAmount - channelNumber) - 1

    return parseFloat(scaledAmplitude + offset)
  },

  isSimulated (flag = 'simulate') {
    return flag === constants.connector.simulateFlag
  }
}

export { signal }
