import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import * as jwt from 'jsonwebtoken'

let key = process.env['TOKEN_SECRET']
if (!key) {
  crypto.randomBytes(48, (err, buffer) => {
    key = buffer.toString('hex')
  })
}

export const createToken = () : object => {
  const id = uuidv4()

  return {
    id,
    token: jwt.sign({ id }, key)
  }
}

export const verifyToken = (token : string) => {
  try {
    return jwt.verify(token, key)
  } catch (e) { 
    return null
  }
}