

export default class TmxMap {

  mapContent : string

  xmlDoc : XMLDocument

  width : number

  height : number

  data : number[][]

  constructor(mapContent : string) {
    this.mapContent = mapContent
  }

  load() {
    this.xmlDoc = new DOMParser().parseFromString(this.mapContent, 'text/xml')

    const map = this.xmlDoc.getElementsByTagName('map')[0]
    this.width = parseInt(map.getAttribute('width'))
    this.height = parseInt(map.getAttribute('height'))

    const layer = map.getElementsByTagName('layer')[0]
    const layerData = layer.getElementsByTagName('data')[0].innerHTML

    this.data = []

    for (const layerRow of layerData.split('\n')) {
      if (!layerRow) {
        continue
      }
      this.data.push(layerRow.split(',').map((v) => parseInt(v)))
    }
  }
}