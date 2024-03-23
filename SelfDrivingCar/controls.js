class Controls{
    constructor(controlType)
    {
       this.forward = false;
       this.reverse = false;
       this.left = false;
       this.right = false;
       this.controlType = controlType;

       //# means private method.
       switch(controlType){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
       }
    }

    #addKeyboardListeners()
    {
        /*
        the reason you use arrow functions is b/c it points to the class's variables 
        and not the local function variables
        for example you can say
        document.onkeydown=function(event){ code }
        but then anytime i call this.left or this.right
        it refers to the this.left or this.right defined in the function
        if I use document.onkeydown=(evt)=>{ code }
        then this.left or this.right refers to the left and right variables defined in the constructor
        the ones that are global to the class.
        */
        document.onkeydown=(event)=>
        {
            switch(event.key)
            {
                //what happens if you remove break? 
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
            //console.table(this);
        }
        document.onkeyup=(event)=>
        {
            switch(event.key)
            {
                //what happens if you remove break? 
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
            //console.table(this);
        }

    }
}