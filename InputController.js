export default class InputController{
    constructor(Gui = document){
        this.Gui = Gui
        
        this.Mouse = {
            LeftButton:false,
            MiddleButton:false,
            RightButton:false,
            MouseX:0,
            MouseY:0
        }

        this.Keys = {}
        this.ToggledKeys = {}
        this.ToggleFunctions = []

        this.Buttons = []

        this.OnMouseDownFunction = (e,InputController_,BeforeBaseFunction) =>{}
        this.OnMouseUpFunction = (e,InputController_,BeforeBaseFunction) =>{}
        this.OnMouseMoveFunction = (e,InputController_,BeforeBaseFunction) =>{}
        this.OnKeyDownFunction = (e,InputController_,BeforeBaseFunction) =>{}
        this.OnKeyUpFunction = (e,InputController_,BeforeBaseFunction) =>{}
        this.OnClickFunction = (e,InputController_,BeforeBaseFunction) =>{}

        this.Gui.addEventListener("mousedown",(e) => this.OnMouseDown(e,this.OnMouseDownFunction),false)
        this.Gui.addEventListener("mouseup",(e) => this.OnMouseUp(e,this.OnMouseUpFunction),false)
        this.Gui.addEventListener("mousemove",(e) => this.OnMouseMove(e,this.OnMouseMoveFunction),false)
        this.Gui.addEventListener("keydown",(e) => this.OnKeyDown(e,this.OnKeyDownFunction),false)
        this.Gui.addEventListener("keyup",(e) => this.OnKeyUp(e,this.OnKeyUpFunction),false)
        this.Gui.addEventListener("click",(e) => this.OnClick(e,this.OnClickFunction),false)
    }
    
    key(KeyCode){
        return (this.Keys[KeyCode] == null)? false:this.Keys[KeyCode]
    }

    ToggleKey(KeyCode,Options = {}){
        Options.CoolDown = (Options.CoolDown == null)? 100:Options.CoolDown
        Options.StartState = (Options.StartState == null)? false:this.Key(KeyCode) 

        this.ToggledKeys[KeyCode] = (this.ToggledKeys[KeyCode] == null)? {
            KeyState:Options.StartState,
            OnCoolDown:false,
            CoolDown:Options.CoolDown,
            Timer:null} :this.ToggledKeys[KeyCode]
        
        if(this.key(KeyCode) && !this.ToggledKeys[KeyCode].OnCoolDown){
            this.ToggledKeys[KeyCode].KeyState = !this.ToggledKeys[KeyCode].KeyState 
            this.ToggledKeys[KeyCode].OnCoolDown = true
            this.ToggledKeys[KeyCode].Timer = setTimeout(()=>{
                this.ToggledKeys[KeyCode].OnCoolDown = false
            },this.ToggledKeys[KeyCode].CoolDown)
        }       
        return this.ToggledKeys[KeyCode]   
    }

    OnMouseDown(e,Function){
        Function(e,this,true)
        switch (e.button){
            case 0:{
                this.Mouse.LeftButton = true
                break
            }
            case 1:{
                this.Mouse.MiddleMouse = true
                break
            }
            case 2:{
                this.Mouse.RightButton = true
                break
            }
        }
        Function(e,this,false)
    }
    
    OnMouseUp(e,Function){
        Function(e,this,true)
        switch (e.button){
            case 0:{
                this.Mouse.LeftButton = false
                break
            }     
            case 1:{
                this.Mouse.MiddleMouse = false
                break
            }
            case 2:{
                this.Mouse.RightButton = false
                break
            }
        }
        Function(e,this,false)
    }

    OnMouseMove(e,Function){
        Function(e,this,true)
        this.Mouse.MouseX = e.movementX
        this.Mouse.MouseY = e.movementY
        Function(e,this,false)
    }

    OnKeyDown(e,Function){
        Function(e,this,true)
        this.Keys[e.key] = true
        Function(e,this,false)
    }

    OnKeyUp(e,Function){
        Function(e,this,true)
        this.Keys[e.key] = false
        Function(e,this,false)
    }

    OnClick(e,Function){
        Function(e,this,true)
        this.Buttons.forEach(Button=>{
            let TempFunction = (Button.Function == null)? () =>{}:Button.Function
            if(e.target == Button["Button"]){
                TempFunction(e,e.target)
            }
        })
        Function(e,this,false)
    }
}
