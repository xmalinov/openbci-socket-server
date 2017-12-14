'use strict'

import { constants } from '../constants'
import { Utils } from '../utils'
import { Cyton } from 'openbci'
import { constants as k } from 'openbci-utilities'

class Serialport extends Cyton {
  constructor (options) {
    super(options)
  }

  start () {
    return new Promise((resolve, reject) => {
      const onConnect = () => {
        this.on(constants.connector.readyEvent, () => {
          this.streamStart()
          console.log('[DEBUG]:' + this.sampleRate())
          resolve()
        })
      }

      this.autoFindOpenBCIBoard()
        .then((portName) => {
          if (portName) {
            this.connect(portName).then(onConnect)
          }
        })
        .catch((error) => {
          console.log(error)
          if (Utils.signal.isSimulated()) {
            this.connect('OpenBCISimulator')
              .then(onConnect)
          } else {
            reject(error)
          }
        })
    })
  }

  stop () {
    this.streamStop().then(() => {
      this.disconnect().then(() => {
        process.exit()
      })
    })
  }

  stream (callback) {
    this.on(constants.connector.sampleEvent, callback)
  }
}

export { Serialport }
