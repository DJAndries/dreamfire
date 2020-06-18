import GameDef from "models/GameDef"
import PlayerDef from "models/PlayerDef"
import { Observable } from "dreamfire-frontend/util"

export default class GameStore {

  gameDef : GameDef

  me : PlayerDef

  playersChangedSub : Observable<GameDef>

}