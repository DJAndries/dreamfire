import * as jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'

export const tokenUserId = (token : string) : string => {
  if (!token) {
    return null
  }

  try {
    return jwt.decode(token)['id']
  } catch (e) {
    return null
  }
}

export const checkUser = (userId : string) => {
  if (!userId) {
    throw new AuthenticationError('NO_USER')
  }
}