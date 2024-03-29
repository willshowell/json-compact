const KeyProvider = require('./key-provider')

function isPureObject(input) {
  return (
    null !== input &&
    typeof input === 'object' &&
    Object.getPrototypeOf(input).isPrototypeOf(Object)
  )
}

function isArray(input) {
  return Array.isArray(input)
}

function isScalar(input) {
  if (input === null || input === undefined) return true
  if (isPureObject(input)) return false
  if (isArray(input)) return false
  return true
}

function isEmpty(input) {
  if (isArray(input)) {
    return input.length === 0
  } else if (isPureObject(input)) {
    return Object.entries(input).length === 0
  }

  return false
}

function _compactRecursive(input, keymap, keyProvider) {
  if (isScalar(input) || isEmpty(input)) {
    return input
  }

  if (isArray(input)) {
    return input.map((element) =>
      _compactRecursive(element, keymap, keyProvider),
    )
  }

  if (isPureObject(input)) {
    const output = {}
    for (const [oldKey, oldValue] of Object.entries(input)) {
      const newKey = keymap.has(oldKey)
        ? keymap.get(oldKey)
        : keyProvider.getNext()
      keymap.set(oldKey, newKey)
      output[newKey] = _compactRecursive(oldValue, keymap, keyProvider, output)
    }
    return output
  }

  throw Error('Unknown data type')
}

function _expandRecursive(input, keymap) {
  if (isScalar(input) || isEmpty(input)) {
    return input
  }

  if (isArray(input)) {
    return input.map((element) => _expandRecursive(element, keymap))
  }

  if (isPureObject(input)) {
    const output = {}
    for (const [oldKey, oldValue] of Object.entries(input)) {
      if (!keymap.has(oldKey)) {
        throw Error(`Unknown key ${oldKey}`)
      }

      const newKey = keymap.get(oldKey)
      output[newKey] = _compactRecursive(oldValue, keymap)
    }
    return output
  }

  throw Error('Unknown data type')
}

function invertMap(map) {
  const output = {}
  for ([k, v] of map.entries()) {
    output[v] = k
  }
  return output
}

function compact(rawInput) {
  if (isScalar(rawInput)) {
    return rawInput
  }

  if (isEmpty(rawInput)) {
    return rawInput
  }

  const keyProvider = KeyProvider()
  const keymap = new Map()
  const output = _compactRecursive(rawInput, keymap, keyProvider)
  return { $: output, _: invertMap(keymap) }
}

function expand(rawInput) {
  if (!isPureObject(rawInput)) {
    return rawInput
  }

  if (isEmpty(rawInput)) {
    return rawInput
  }

  const input = rawInput.$
  const keymap = new Map(Object.entries(rawInput._))
  return _expandRecursive(input, keymap)
}

module.exports = {
  compact,
  expand,
}
