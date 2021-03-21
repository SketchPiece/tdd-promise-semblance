let SketchPromise = require('./promise.js')

const t = setTimeout

describe('Sketch promise:', () => {
  let promise
  let executorSpy

  const successResult = 42
  const errorResult = 'I am error'

  beforeEach(() => {
    executorSpy = jest.fn(r => t(() => r(successResult), 150))
    promise = new SketchPromise(executorSpy)
  })

  test('should exists and to be type of function', () => {
    expect(SketchPromise).toBeDefined()
    expect(typeof SketchPromise).toBe('function')
  })

  test('instance should have methods: then, catch, finally', () => {
    expect(promise.then).toBeDefined()
    expect(promise.catch).toBeDefined()
    expect(promise.finally).not.toBeUndefined()
  })

  test('should call executor function', () => {
    expect(executorSpy).toBeCalled()
  })

  test('should get data in then block and chain then', async () => {
    const result = await promise.then(num => num).then(num => num * 2)
    expect(result).toBe(successResult * 2)
  })

  test('should catch error', () => {
    const errorExecutor = (_, r) => t(() => r(errorResult), 150)
    const errorPromise = new SketchPromise(errorExecutor)

    return new Promise(resolve => {
      errorPromise.catch(error => {
        expect(error).toBe(errorResult)
        resolve()
      })
    })
  })

  test('should call finally method', async () => {
    const finallySpy = jest.fn(() => {})
    await promise.finally(finallySpy)
    expect(finallySpy).toHaveBeenCalled()
  })
})
