const keyProvider = require('./key-provider')

test('should deliver keys', () => {
  const provider = keyProvider()

  let keys = []
  for (let i = 0; i < 5; i++) {
    keys.push(provider.getNext())
  }

  expect(keys).toEqual(['a', 'b', 'c', 'd', 'e'])
})

test('should wrap', () => {
  const provider = keyProvider()
  expect(provider.getNext()).toBe('a')

  provider.__skipTo(85 - 1)
  expect(provider.getNext()).toBe('.')
  expect(provider.getNext()).toBe('aa')
  expect(provider.getNext()).toBe('ab')

  provider.__skipTo(170 - 1)
  expect(provider.getNext()).toBe('a.')
  expect(provider.getNext()).toBe('ba')
  expect(provider.getNext()).toBe('bb')

  provider.__skipTo(7310 - 1)
  expect(provider.getNext()).toBe('..')
  expect(provider.getNext()).toBe('aaa')
  expect(provider.getNext()).toBe('aab')
})
