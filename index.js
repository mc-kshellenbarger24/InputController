/**
 * A class that handles input events.
 * @class
 * @param {HTMLElement} Gui The root element of the GUI.
 * @property {Object} Mouse // Mouse data.
 * @property {Object} Keys // Key data
 * @property {Array<Object>} Buttons // Onclick Buttons
 * @property {Function} OnMouseUpFunction //Callbacks
 * @property {Function} OnMouseMoveFunction //Callbacks
 * @property {Function} OnKeyDownFunction //Callbacks
 * @property {Function} OnKeyUpFunction //Callbacks
 * @property {Function} OnClickFunction //Callbacks
 */

export class InputController {
	// Constructor

	constructor(Gui = document) {
		// The root element of the GUI
		this.Gui = Gui
		/**
		 * @type {Object}
		 * @property {boolean} LeftButton Whether the left mouse button is down.
		 * @property {boolean} MiddleButton Whether the middle mouse button is down.
		 * @property {boolean} RightButton Whether the right mouse button is down.
		 * @property {number} MouseX The current mouse X position.
		 * @property {number} MouseY The current mouse Y position.
		 * @example
		 * Mouse.LeftButton // Whether the left mouse button is down.
		 */
		this.Mouse = {
			// Whether the left mouse button is down
			LeftButton: false,
			// Whether the middle mouse button is down
			MiddleButton: false,
			// Whether the right mouse button is down
			RightButton: false,
			// The current mouse X position
			MouseX: 0,
			// The current mouse Y position
			MouseY: 0,
		}

		/**
		 * @type {Object}
		 * @example
		 * Keys["E"] // Whether the E Key is down or up. Also can come back as null if it hasnt be pressed
		 */
		this.Keys = {}

		this.ToggledKeys = {}

		/**
		 * @type {Array<Object>}
		 * @property {Element} Button // the element to check rather or not its been clicked
		 * @property {Function} Function // CallBack
		 * @param {Event} e // Onclick Event
		 * @param {Element} Target // Clicked on Element
		 * @example
		 * Buttons =
		 *  [
		 *      {
		 *          Button:document.getElementById("Button"),
		 *          Function:(e,Target)=>{}
		 *      }
		 *  ]
		 */
		this.Buttons = []

		/**
		 * Handles a mousedown event.
		 * @type {Function}
		 * @param {MouseEvent} e The mouse event.
		 * @param {this} InputController_ The Class that called the function
		 * @param {boolean} BeforeBaseFunction true if it comes before the function and false if after the custom function
		 */
		this.OnMouseDownFunction = (e, InputController_, BeforeBaseFunction) => {}
		this.OnMouseUpFunction = (e, InputController_, BeforeBaseFunction) => {}
		this.OnMouseMoveFunction = (e, InputController_, BeforeBaseFunction) => {}
		this.OnKeyDownFunction = (e, InputController_, BeforeBaseFunction) => {}
		this.OnKeyUpFunction = (e, InputController_, BeforeBaseFunction) => {}
		this.OnClickFunction = (e, InputController_, BeforeBaseFunction) => {}

		// Attach event listeners
		this.Gui.addEventListener("mousedown", (e) => this.OnMouseDown(e, this.OnMouseDownFunction), false)
		this.Gui.addEventListener("mouseup", (e) => this.OnMouseUp(e, this.OnMouseUpFunction), false)
		this.Gui.addEventListener("mousemove", (e) => this.OnMouseMove(e, this.OnMouseMoveFunction), false)
		this.Gui.addEventListener("keydown", (e) => this.OnKeyDown(e, this.OnKeyDownFunction), false)
		this.Gui.addEventListener("keyup", (e) => this.OnKeyUp(e, this.OnKeyUpFunction), false)
		this.Gui.addEventListener("click", (e) => this.OnClick(e, this.OnClickFunction), false)
	}
	/**
	 * Returns whether the specified key is down.
	 * @type {Function}
	 * @param {string} KeyCode The key code.
	 * @returns {boolean} Whether the key is down.
	 */
	key(KeyCode) {
		return this.Keys[KeyCode] == null ? false : this.Keys[KeyCode]
	}
	/**
	 * Returns whether the specified key is Toggled.
	 * @type {Function}
	 * @param {string} KeyCode The key code.
	 * @param {Object} Options The options object
	 * @param {number} Options.CoolDown The cooldown period in milliseconds.
	 * @param {boolean} Options.StartState The initial state of the key.
	 * @default Options {}
	 * @default Options.StartState false
	 * @default Options.CoolDown 100ms
	 * @returns {Object} Options
	 * @example
	 *  ToggleKey("e",{
	 *      KeyState: Options.StartState // to get the State of the key true or false,
	 *      CoolDown: 1000 //ms,
	 *      Timer: null // The timer,
	 *  })
	 */
	ToggleKey(KeyCode, Options = {}) {
		Options.CoolDown = Options.CoolDown == null ? 100 : Options.CoolDown
		Options.StartState = Options.StartState == null ? false : this.Key(KeyCode)

		this.ToggledKeys[KeyCode] =
			this.ToggledKeys[KeyCode] == null
				? {
						KeyState: Options.StartState,
						OnCoolDown: false,
						CoolDown: Options.CoolDown,
						Timer: null,
				  }
				: this.ToggledKeys[KeyCode]

		if (this.key(KeyCode) && !this.ToggledKeys[KeyCode].OnCoolDown) {
			this.ToggledKeys[KeyCode].KeyState = !this.ToggledKeys[KeyCode].KeyState
			this.ToggledKeys[KeyCode].OnCoolDown = true
			this.ToggledKeys[KeyCode].Timer = setTimeout(() => {
				this.ToggledKeys[KeyCode].OnCoolDown = false
			}, this.ToggledKeys[KeyCode].CoolDown)
		}
		return this.ToggledKeys[KeyCode]
	}

	OnMouseDown(e, Function) {
		Function(e, this, true)
		switch (e.button) {
			case 0: {
				this.Mouse.LeftButton = true
				break
			}
			case 1: {
				this.Mouse.MiddleMouse = true
				break
			}
			case 2: {
				this.Mouse.RightButton = true
				break
			}
		}
		Function(e, this, false)
	}

	OnMouseUp(e, Function) {
		Function(e, this, true)
		switch (e.button) {
			case 0: {
				this.Mouse.LeftButton = false
				break
			}
			case 1: {
				this.Mouse.MiddleMouse = false
				break
			}
			case 2: {
				this.Mouse.RightButton = false
				break
			}
		}
		Function(e, this, false)
	}

	OnMouseMove(e, Function) {
		Function(e, this, true)
		this.Mouse.MouseX = e.movementX
		this.Mouse.MouseY = e.movementY
		Function(e, this, false)
	}

	OnKeyDown(e, Function) {
		Function(e, this, true)
		this.Keys[e.key] = true
		Function(e, this, false)
	}

	OnKeyUp(e, Function) {
		Function(e, this, true)
		this.Keys[e.key] = false
		Function(e, this, false)
	}

	OnClick(e, Function) {
		Function(e, this, true)
		const Leng = this.Buttons
		while (Leng--) {
			Button = this.Buttons[Leng]
			let TempFunction = Button.Function == null ? () => {} : Button.Function
			if (e.target == Button["Button"]) {
				TempFunction(e, e.target)
			}
		}
		Function(e, this, false)
	}
}

/**
 * Returns whether the specified key is Toggled.
 * @type {Function}
 * @param {number} Start Start number of the lerp
 * @param {number} End End number of the lerp
 * @param {number} Duration Time it takes to finish the lerp
 * @param {number} FPS Frames per second that the lerp updates
 * @default FPS 60
 * @param {boolean} Reverse rather or not it goes backwords from end to start
 * @default Reverse false
 * @param {Function} StartCallBack Called when the lerp starts
 * @default StartCallBack (Value, ArgsTable) => null
 * @returns {Object} Args to send to the start, update, and done callbacks
 * @param {number} StartCallBack.Value The current value of the lerp.
 * @param {Object} StartCallBack.ArgsTable The arguments table passed to the callback function.
 * @param {Function} CallBackFunction Called when the lerp is updating
 * @default CallBackFunction (Value, ArgsTable) => null
 * @returns {Object} Args to send to the start, update, and done callbacks
 * @param {number} CallBackFunction.Value The current value of the lerp.
 * @param {Object} CallBackFunction.ArgsTable The arguments table passed to the callback function.
 * @param {Function} DoneCallBack Called when the lerp is done and has reached end
 * @default DoneCallBack (Value, ArgsTable) => null
 * @returns {Object} Args to send to the start, update, and done callbacks
 * @param {number} DoneCallBack.Value The current value of the lerp.
 * @param {Object} DoneCallBack.ArgsTable The arguments table passed to the callback function.
 * @param {Function} EaseFunction
 * @param {number} EaseFunction.t time
 * @default EaseFunction (t) => t
 *
 */
export function LerpAnimate(
	Start,
	End,
	Duration,
	FPS = 60,
	Reverse = false,
	StartCallBack = (Value, ArgsTable) => {
		return null
	},
	CallBackFunction = (Value, ArgsTable) => {
		return null
	},
	DoneCallBack = (Value, ArgsTable) => {
		return null
	},
	EaseFunction = (T) => {
		return T
	}
) {
	let Value = Start
	let StartTime = Date.now()
	let lerp = (start, end, t) => {
		return start * (1 - t) + end * t
	}
	let ArgsTable = [
		(Name = {
			Name: "Start",
			Args: [],
		}),
		{
			Name: "Going",
			Args: [],
		},
		{
			Name: "Done",
			Args: [],
		},
	]
	StartArg = StartCallBack(Value, ArgsTable)
	ArgsTable[0].Args = StartArg
	if (Reverse) {
		CheckValue = End
	} else {
		CheckValue = Start
	}
	let Update = setInterval(function () {
		let Progress = Date.now() - StartTime
		if (Progress < Duration || Math.round(Value) == CheckValue) {
			let Pct = EaseFunction(Progress / Duration)
			if (Reverse) {
				Pct = 1 - Pct
			}
			Value = lerp(Start, End, Pct)
			GoingArgs = CallBackFunction(Value, ArgsTable)
			ArgsTable[1].Args = GoingArgs
		} else {
			Value = Math.round(Value)
			GoingArgs = CallBackFunction(Value, ArgsTable)
			DoneArgs = DoneCallBack(Value, ArgsTable)
			ArgsTable[1].Args = GoingArgs
			ArgsTable[2].Args = DoneArgs
			clearInterval(Update)
		}
	}, 1000 / FPS)
	return Update
}
