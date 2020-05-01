import BlokusGameDef from "models/GameDef"
import PlayerDef from "models/PlayerDef"
import { Observable } from "dreamfire-frontend/util"

export default class GameStore {

  gameDef : BlokusGameDef

  me : PlayerDef

  playersChangedSub : Observable<BlokusGameDef>

}