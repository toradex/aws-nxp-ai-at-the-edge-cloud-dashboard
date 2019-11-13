export const CB = {
  id: 'cb',
  name: 'CB'
}
export const CPU = {
  id: 'cpu',
  name: 'CPU',
  loadName: 'CPU load',
  dbField: 'processing-load'
}
export const GPU = {
  id: 'gpu',
  name: 'GPU',
  loadName: 'GPU memory usage',
  dbField: 'memory-load'
}
export const INFERENCE = {
  id: 'inference',
  name: 'INFERENCE'
}
export const LED = {
  id: 'led',
  name: 'LED'
}
export const RAM = {
  id: 'ram',
  name: 'RAM',
  loadName: 'Global memory usage',
  dbField: 'memory-load'

}

export default [CB, CPU, GPU, INFERENCE, LED, RAM]
