import CommClient from "../comm/CommClient"
import AssetManager from "../assets/AssetManager"
import Stage from "../stages/Stage"
import DCanvas from "../gfx/DCanvas"

export default class BaseGameContext {

  commClient : CommClient

  assetManager : AssetManager

  currentStage : Stage

  dCanvas : DCanvas
}