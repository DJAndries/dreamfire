import PlayerDef from "./PlayerDef"

export default interface GameDef {
  gameName: string
  players: PlayerDef[]
}