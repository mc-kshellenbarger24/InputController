/**
 * A class that handles input events.
 * @class
 * @param {HTMLElement} Gui The root element of the GUI.
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
		 * @property {HTMLElement} Button // the element to check rather or not its been clicked
		 * @property {Function} Function // CallBack
		 * @param {Event} e // Onclick Event
		 * @param {HTMLElement} Target // Clicked on Element
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

	/**
	 * Called when the mouse button is pressed down.
	 *
	 * @param {MouseEvent} e The mouse event.
	 * @param {Object} This The object that the event is being called on.
	 * @param {boolean} IsDown Whether the button is being pressed down.
	 */
	OnMouseDown(e, Function) {
		// Call the callback function with the event and the object.
		Function(e, this, true)

		// Set the corresponding mouse button flag.
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

		// Call the callback function with the event and the object.
		Function(e, this, false)
	}

	/**
	 * Called when the mouse button is released.
	 *
	 * @param {MouseEvent} e The mouse event.
	 * @param {Object} This The object that the event is being called on.
	 * @param {boolean} IsDown Whether the button was pressed down.
	 */
	OnMouseUp(e, Function) {
		// Call the callback function with the event and the object.
		Function(e, this, true)

		// Set the corresponding mouse button flag.
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

		// Call the callback function with the event and the object.
		Function(e, this, false)
	}

	/**
	 * Called when the mouse moves.
	 *
	 * @param {MouseEvent} e The mouse event.
	 * @param {Object} This The object that the event is being called on.
	 * @param {boolean} IsDown Whether the mouse button is being pressed down.
	 */
	OnMouseMove(e, Function) {
		// Call the callback function with the event and the object.
		Function(e, this, true)

		// Update the mouse position.
		this.Mouse.MouseX = e.movementX
		this.Mouse.MouseY = e.movementY

		// Call the callback function with the event and the object.
		Function(e, this, false)
	}

	/**
	 * Called when a key is pressed down.
	 *
	 * @param {KeyboardEvent} e The keyboard event.
	 * @param {Object} This The object that the event is being called on.
	 * @param {boolean} IsDown Whether the key is being pressed down.
	 */
	OnKeyDown(e, Function) {
		// Call the callback function with the event and the object.
		Function(e, this, true)

		// Set the corresponding key flag.
		this.Keys[e.key] = true

		// Call the callback function with the event and the object.
		Function(e, this, false)
	}

	/**
	 * Called when a key is released.
	 *
	 * @param {KeyboardEvent} e The keyboard event.
	 * @param {Object} This The object that the event is being called on.
	 * @param {boolean} IsDown Whether the key was pressed down.
	 */
	OnKeyUp(e, Function) {
		// Call the callback function with the event and the object.
		Function(e, this, true)

		// Set the corresponding key flag.
		this.Keys[e.key] = false

		// Call the callback function with the event and the object.
		Function(e, this, false)
	}
	/**
	 * Called when a button is clicked.
	 *
	 * @param {MouseEvent} e The mouse event.
	 * @param {Object} This The object that the event is being called on.
	 * @param {boolean} IsDown Whether the button is being pressed down.
	 */
	OnClick(e, Function) {
		// Call the callback function with the event and the object.
		Function(e, this, true)

		// Loop through all the buttons.
		const Leng = this.Buttons.length
		while (Leng--) {
			// Get the current button.
			const Button = this.Buttons[Leng]

			// Get the function associated with the button.
			const TempFunction = Button.Function == null ? () => {} : Button.Function

			// If the button is the target of the event, call the function.
			if (e.target == Button["Button"]) {
				TempFunction(e, e.target)
			}
		}

		// Call the callback function with the event and the object.
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
	// Set the initial values.
	let Value = Start
	let StartTime = Date.now()

	// Create a function to calculate the lerp value.
	let lerp = (start, end, t) => {
		return start * (1 - t) + end * t
	}

	// Create an array to store the callback arguments.
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

	// Call the start callback function.
	let StartArg = StartCallBack(Value, ArgsTable)
	ArgsTable[0].Args = StartArg

	// Set the check value.
	let CheckValue = Reverse ? End : Start

	// Create an interval to update the value.
	let Update = setInterval(function () {
		// Calculate the progress.
		let Progress = Date.now() - StartTime

		// If the animation is not finished, update the value.
		if (Progress < Duration || Math.round(Value) == CheckValue) {
			// Calculate the lerp percentage.
			let Pct = EaseFunction(Progress / Duration)

			// Reverse the percentage if the animation is reversed.
			if (Reverse) {
				Pct = 1 - Pct
			}

			// Update the value.
			Value = lerp(Start, End, Pct)

			// Call the callback function.
			GoingArgs = CallBackFunction(Value, ArgsTable)
			ArgsTable[1].Args = GoingArgs
		} else {
			// The animation is finished, so clear the interval and call the done callback function.
			Value = Math.round(Value)
			GoingArgs = CallBackFunction(Value, ArgsTable)
			DoneArgs = DoneCallBack(Value, ArgsTable)
			ArgsTable[1].Args = GoingArgs
			ArgsTable[2].Args = DoneArgs
			clearInterval(Update)
		}
	}, 1000 / FPS)

	// Return the interval ID.
	return Update
}
/**
 * @class
 * @param {Function} scoreFunction Function that scores how the array is setup
 */
export class BinaryHeap {
	constructor(
		scoreFunction = (e) => {
			return e
		}
	) {
		this.Heap = []
		this.scoreFunction = scoreFunction
		this.UnchangedScoreFunction = scoreFunction
	}
	/**
	 * Inserts an element into the heap.
	 *
	 * @param {any} element The element to insert.
	 */
	insert(element) {
		// Add the new element to the end of the array.
		this.Heap.push(element)

		// Allow it to sink down.
		this.SinkDown(this.Heap.length - 1)
	}

	/**
	 * Deletes the root element from the heap.
	 *
	 * @returns {any} The root element.
	 */
	DeleteRoot() {
		// Store the first element so we can return it later.
		var result = this.Heap[0]

		// Get the element at the end of the array.
		var end = this.Heap.pop()

		// If there are any elements left, put the end element at the
		// start, and let it bubble up.
		if (this.Heap.length > 0) {
			this.Heap[0] = end
			this.BubbleUp(0)
		}

		return result
	}
	/**
	 * Removes an element from the heap.
	 *
	 * @param {any} element The element to remove.
	 */
	Remove(element) {
		// Find the index of the element.
		var i = -1
		this.Heap.find((item, i_) => {
			if (item === element) {
				i = i_
				return true
			}
		})

		// If the element is not found, return.
		if (i === -1) {
			return
		}

		// Remove the element from the heap.
		var end = this.Heap.pop()

		// If the element is not at the root, bubble up or sink down.
		if (i !== this.Heap.length - 1) {
			if (this.scoreFunction(end) < this.scoreFunction(element)) {
				this.SinkDown(i)
			} else {
				this.BubbleUp(i)
			}
		}
	}

	/**
	 * Returns the number of elements in the heap.
	 */
	Size() {
		return this.Heap.length
	}
	/**
	 * Rescore an element in the heap.
	 *
	 * @param {any} element The element to rescore.
	 */
	RescoreElement(element) {
		// Find the index of the element.
		var i = this.Heap.indexOf(element)

		// If the element is not found, return.
		if (i === -1) {
			return
		}

		// Bubble up the element.
		this.BubbleUp(i)
	}

	/**
	 * Pops the top element from the heap.
	 *
	 * @returns {any} The top element.
	 */
	Pop() {
		// Store the first element so we can return it later.
		var result = this.Heap[0]

		// Get the element at the end of the array.
		var end = this.Heap.pop()

		// If there are any elements left, put the end element at the
		// start, and let it bubble up.
		if (this.Heap.length > 0) {
			this.Heap[0] = end
			this.BubbleUp(0)
		}

		return result
	}

	/**
	 * Returns the maximum element in the heap.
	 *
	 * @returns {any} The maximum element.
	 */
	Max() {
		// Set the score function to return the negative of the original score function.
		this.scoreFunction = (e) => {
			return -this.UnchangedScoreFunction(e)
		}

		// Sink all the elements down the heap.
		var Leng = this.Heap.length
		while (Leng--) {
			this.SinkDown(Leng)
		}

		// Return the top element.
		return this.Heap[0]
	}

	/**
	 * Returns the minimum element in the heap.
	 *
	 * @returns {any} The minimum element.
	 */
	Min() {
		// Set the score function to return the original score function.
		this.scoreFunction = (e) => {
			return this.UnchangedScoreFunction(e)
		}

		// Sink all the elements down the heap.
		var Leng = this.Heap.length
		while (Leng--) {
			this.SinkDown(Leng)
		}

		// Return the top element.
		return this.Heap[0]
	}
	/**
	 * Sinks an element down the heap until it is in the correct position.
	 *
	 * @param {number} n The index of the element to sink down.
	 */
	SinkDown(n) {
		// Fetch the element that has to be sunk.
		var element = this.Heap[n]

		// When at 0, an element can not sink any further.
		while (n > 0) {
			// Compute the parent element's index, and fetch it.
			var parentN = ((n + 1) >> 1) - 1
			var parent = this.Heap[parentN]

			// Swap the elements if the parent is greater.
			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				// Swap the elements.
				this.Heap[parentN] = element
				this.Heap[n] = parent

				// Update 'n' to continue at the new position.
				n = parentN
			}
			// Found a parent that is less, no need to sink any further.
			else {
				break
			}
		}
	}

	/**
	 * Bubbles an element up the heap until it is in the correct position.
	 *
	 * @param {number} n The index of the element to bubble up.
	 */
	BubbleUp(n) {
		// Look up the target element and its score.
		var length = this.Heap.length
		var element = this.Heap[n]
		var elemScore = this.scoreFunction(element)

		// While the element is not at the root and its score is less than that of its parent...
		while (n > 0) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) << 1
			var child1N = child2N - 1
			// This is used to store the new position of the element, if any.
			var swap = null
			var child1Score

			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.Heap[child1N]
				child1Score = this.scoreFunction(child1)

				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore) {
					swap = child1N
				}
			}

			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.Heap[child2N]
				var child2Score = this.scoreFunction(child2)
				if (child2Score < (swap === null ? elemScore : child1Score)) {
					swap = child2N
				}
			}

			// If the element needs to be moved, swap it, and continue.
			if (swap !== null) {
				this.Heap[n] = this.Heap[swap]
				this.Heap[swap] = element
				n = swap
			}
			// Otherwise, we are done.
			else {
				break
			}
		}
	}
	/**
	 * Sort the heap.
	 *
	 * @return The sorted array.
	 */
	sort() {
		// Create an empty array to store the sorted elements.
		const sortedArray = []
		// While the heap is not empty, remove the top element and add it to the sorted array.
		while (this.Size() != 0) {
			sortedArray.push(this.DeleteRoot())
		}
		// Return the sorted array.
		return sortedArray
	}

	/**
	 * Get the sum of all elements in the heap.
	 *
	 * @return The sum of all elements in the heap.
	 */
	sum() {
		// Create a variable to store the sum.
		let sum = 0
		// Iterate over the heap and add each element to the sum.
		for (let i = 0; i < this.Size(); i++) {
			sum += this.UnchangedScoreFunction(this.Heap[i])
		}
		// Return the sum.
		return sum
	}
	/**
	 * Get the average of all elements in the heap.
	 *
	 * @return The average of all elements in the heap.
	 */
	average() {
		// Return the sum of all elements in the heap divided by the size of the heap.
		return this.sum() / this.Size()
	}

	/**
	 * Check if an element is in the heap.
	 *
	 * @param element The element to check for.
	 * @return True if the element is in the heap, false otherwise.
	 */
	contains(element) {
		// Return true if the element is in the heap, false otherwise.
		return element in this.Heap
	}

	/**
	 * Build a heap from an array.
	 *
	 * @param array The array to build the heap from.
	 */
	buildHeap(array) {
		// Create an empty heap.
		this.Heap = []
		var Length = array.length
		while (Length--) {
			this.insert(array[Length])
		}
	}
}
