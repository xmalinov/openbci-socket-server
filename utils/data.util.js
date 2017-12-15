'use strict'

const data = {
  parseObjectAsArray (obj) {
    return Object.keys(obj).reduce((result, key) => [...result, obj[key]], [])
  },

  /**
   * generateTimeline
   * @param size
   * @param skip
   * @param suffix
   * @returns {Array.<T>}
   */
  generateTimeline (size, skip, suffix) {
    return new Array(size)
      .fill()
      .map((value, index) => index)
      .filter((value, index) => index % skip === 0)
      .map((value) => (value ? '-' : '') + value + suffix)
      .reverse()
  }
}

export { data }
