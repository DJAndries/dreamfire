import { listen, GatewayConfig } from 'dreamfire-gateway'

const isProd = process.env.NODE_ENV === 'production'

const config : GatewayConfig = {
  port: isProd ? 80 : 4001,
  games: [
    {
      hostname: isProd ? 'tempgame' : 'localhost:4000',
      prefix: 'Temp'
    }
  ]
}

listen(config)