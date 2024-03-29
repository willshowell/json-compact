const { compact, expand } = require('./index')

test('should compact a basic object and expand it', () => {
  const basicObject = {
    myLongKeyName: {
      foo: [1, 2, 3],
      bar: {
        deeperStill: 'foo',
      },
    },
  }

  const compacted = compact(basicObject)
  expect(compacted).toEqual({
    $: {
      a: {
        b: [1, 2, 3],
        c: {
          d: 'foo',
        },
      },
    },
    _: {
      a: 'myLongKeyName',
      b: 'foo',
      c: 'bar',
      d: 'deeperStill',
    },
  })

  const expanded = expand(compacted)
  expect(expanded).toEqual(basicObject)
})

test('should work for arrays of objects', () => {
  const input = [
    { longNameFoo: 1, longNameBar: 2 },
    { longNameFoo: 2, longNameBar: 2 },
    { longNameFoo: 3, longNameBar: 2 },
    { longNameFoo: 4, longNameBar: 2 },
    { longNameFoo: 5, longNameBar: 2 },
    { longNameFoo: 6, longNameBar: 9 },
  ]

  const compacted = compact(input)
  expect(compacted).toEqual({
    $: [
      { a: 1, b: 2 },
      { a: 2, b: 2 },
      { a: 3, b: 2 },
      { a: 4, b: 2 },
      { a: 5, b: 2 },
      { a: 6, b: 9 },
    ],
    _: {
      a: 'longNameFoo',
      b: 'longNameBar',
    },
  })

  const expanded = expand(compacted)
  expect(expanded).toEqual(input)
})

test('should passthrough scalars', () => {
  expect(compact('foo')).toEqual('foo')
  expect(expand('foo')).toEqual('foo')

  expect(compact(1)).toEqual(1)
  expect(expand(1)).toEqual(1)

  expect(compact(null)).toEqual(null)
  expect(expand(null)).toEqual(null)

  expect(compact(undefined)).toEqual(undefined)
  expect(expand(undefined)).toEqual(undefined)
})

test('should not touch empty objects and arrays', () => {
  expect(compact([])).toEqual([])
  expect(expand([])).toEqual([])

  expect(compact({})).toEqual({})
  expect(expand({})).toEqual({})
})
