const Signals = require( "mnf/events/Signals" )

class PaletteBooleanButton {

  constructor() {
    this.type = "boolean"

    this._state = "released"

    this.onAction = new Signals()
  }

  set state( value ) {
    this._state = value == 144 ? "pressed" : "released"
    this.onAction.dispatch( this._state )
  }
  get state() { return this._state }
}

module.exports = PaletteBooleanButton
