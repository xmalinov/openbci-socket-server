'use strict'

import Fili from 'fili'

const filter = {

  state: {
    BANDPASS: '1-50',
    NOTCH: '60',
    VERTSCALE: '50',
    VERTALGO: 'LOG',
    SMOOTH: '0-75',
    POLARITY: 'YES',
    MAXFREQUENCY: '60'
  },

  apply (filter) {
    if (!filter) {
      return
    }

    const [id, value] = filter.split(':')

    this.state[id] = value
  },

  process (signal) {
    Object.keys(this.state).forEach((key) => {
      const filter = key.toLowerCase()

      if (filter in this && typeof this[filter] === 'function') {
        // @TODO: apply all filters dynamically
        // signal = this[filter](signal);
      }
    })

    return this.notch(signal)
  },

  highpass (signal) {
    const iirCalculator = new Fili.CalcCascades()

    const hpFilterCoeffs = iirCalculator.highpass({
      order: 4, // cascade 4 biquad filters (max: 12)
      characteristic: 'butterworth',
      Fs: 250, // sampling frequency
      Fc: 1,
      gain: 0, // gain for peak, lowshelf and highshelf
      preGain: false // adds one constant multiplication for highpass and lowpass
      // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    })

    const hpFilter = new Fili.IirFilter(hpFilterCoeffs)

    return hpFilter.multiStep(signal)
  },

  notch (signal) {
    if (this.state.NOTCH === 'NONE') {
      return signal
    }

    const notchValue = parseInt(this.state.NOTCH)
    const iirCalculator = new Fili.CalcCascades()
    const notchFilterCoeffs = iirCalculator.bandstop({
      order: 2, // cascade 3 biquad filters (max: 12)
      characteristic: 'butterworth',
      Fs: 250, // sampling frequency
      Fc: notchValue,
      F1: notchValue - 1,
      F2: notchValue + 1,
      gain: 0, // gain for peak, lowshelf and highshelf
      preGain: false // adds one constant multiplication for highpass and lowpass
      // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    })

    const notchFilter = new Fili.IirFilter(notchFilterCoeffs)

    return notchFilter.multiStep(signal)
  },

  bandpass (signal) {
    // @TODO: Finish bandpass filter
    // return filter
    return void 0

    /*
    const iirCalculator = new Fili.CalcCascades()

    const hpFilterCoeffs = iirCalculator.highpass({
      order: 3, // cascade 3 biquad filters (max: 12)
      characteristic: 'butterworth',
      Fs: sampleRate, // sampling frequency
      Fc: 1,
      gain: 0, // gain for peak, lowshelf and highshelf
      preGain: false // adds one constant multiplication for highpass and lowpass
      // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    })

    const hpFilter = new Fili.IirFilter(hpFilterCoeffs)

    const lpFilterCoeffs = iirCalculator.lowpass({
      order: 3, // cascade 3 biquad filters (max: 12)
      characteristic: 'butterworth',
      Fs: sampleRate, // sampling frequency
      Fc: 50,
      gain: 0, // gain for peak, lowshelf and highshelf
      preGain: false // adds one constant multiplication for highpass and lowpass
      // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    })

    const lpFilter = new Fili.IirFilter(lpFilterCoeffs)
    */
    // @TODO: get from state which filter to use, then return it based on state settings
  },

  filterBand (spectrums, labels, range) {
    if (!spectrums) {
      console.log('Please provide spectrums')

      return
    }

    const filteredSpectrums = spectrums.map((channel) => {
      return channel.filter((spectrum, index) => {
        return labels[index] >= range[0] && labels[index] <= range[1]
      })
    })

    const resultSpectrums = [filteredSpectrums.map((channel) => {
      return channel.length
        ? channel.reduce((a, b) => a + b) / channel.length
        : channel
    })]

    return {
      spectrums: resultSpectrums,
      labels
    }
  }
}

export {filter}
