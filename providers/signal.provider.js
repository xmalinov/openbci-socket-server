'use strict'

import { EventEmitter } from 'events'

import {constants} from '../constants'
import {Utils} from '../utils'

class SignalEmitter extends EventEmitter {}

class Signal {
  constructor ({io}) {
    this.io = io
    this.emitter = new SignalEmitter()

    const {bufferSize, windowSize, sampleRate} = constants.signal;

    this.bufferSize = bufferSize
    this.windowSize = windowSize
    this.sampleRate = sampleRate
    this.signals = [[], [], [], [], [], [], [], []]
    this.sampleNumber = 0
    this.init()
  }

  init () {
    this.io.on('connection', (socket) => {
      socket.on(constants.events.filter, (filter) => {
        Utils.filter.apply(filter)
      })
    })

    this.setScale()
  }

  buffer (sample) {
    this.sampleNumber++
    this.add(sample)

    if (this.sampleNumber === this.bufferSize) {
      this.emitter.emit(constants.events.signal, [...this.signals])
      this.window()
    }
  }

  add (sample) {
    // console.log('sample', sample)
    Object.keys(sample.channelData).forEach((channel, i) => {
      this.signals[i].push(sample.channelData[channel])
    })
  }

  window () {
    this.signals = this.signals.map((channel) => {
      return channel.filter((signal, index) => {
        return index > (this.windowSize - 1)
      })
    })
    this.sampleNumber = this.bufferSize - this.windowSize
  }

  setScale () {
    this.scale = Utils.signal.isSimulated()
      ? constants.scale.simulated
      : constants.scale.global
  }
}

export { Signal }
