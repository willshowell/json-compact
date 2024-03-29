const DEFAULT_CHAR_SET =
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  '!@#$%^&*()+-[]{};:?><,.'

/**
 * Supply incrementing short keys:
 *   [a, b, c, ... aa, ab, ac, ... aaa, aab, ...]
 */
const keyProvider = (charSet = DEFAULT_CHAR_SET) => {
  let i = 0

  return {
    getNext: () => {
      let str = ''
      let p = i++

      while (p >= charSet.length) {
        const div = Math.floor(p / charSet.length) - 1
        const remainder = p % charSet.length

        str = charSet[remainder] + str
        p = div
      }

      str = charSet[p] + str
      return str
    },

    __skipTo: (newIndex) => {
      i = newIndex
    },
  }
}

module.exports = keyProvider
