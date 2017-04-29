const Signals = require( "mnf/events/Signals" )

class PaletteNumberButton {

  constructor() {
    this.type = "number"

    this._percent = 0

    this.onPercentChange = new Signals()
  }

  set percent( value ) {
    this._percent = value
    this.onPercentChange.dispatch( this._percent )
  }
  get percent() { return this._percent }

}

module.exports = PaletteNumberButton
