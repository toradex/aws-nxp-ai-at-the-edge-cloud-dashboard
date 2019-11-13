// this ourUrl was designed for backend so it works only from lambda
export const ourUrl = process.env.RECORD_SET || 'localhost:8585'
export const urlProtocol = process.env.RECORD_SET ? 'https' : 'http'
