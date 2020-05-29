import DreamfireServer from 'dreamfire-backend/DreamfireServer'
import typeDefs from './type_defs'
import resolvers, { playerLeave } from './resolvers'
import GameManager from './models/GameManager'

const gameManager = new GameManager()

const server = new DreamfireServer({
  typeDefs,
  resolvers,
  onUserLeave: (userId : string) => playerLeave(gameManager, userId),
  baseContext: { gameManager }
})

server.listen(process.env.NODE_ENV === 'production' ? 80 : 4000)