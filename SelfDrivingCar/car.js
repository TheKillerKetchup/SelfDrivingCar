class Car{
    constructor(x,y,width,height,controlType, maxSpeed = 20, minSpeed = -10)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controlType = controlType;

        /*
        this.speedY = 0;
        this.accelerationY = 0.2;
        this.maxSpeedY = 3;
        this.minSpeedY = -1.5
        this.frictionY = 0.05;

        
        this.speedX = 0;
        this.accelerationX = 0.2;
        this.maxSpeedX = 3;
        this.minSpeedX = -1.5;
        this.frictionX = 0.05;
        */
        
        this.speed = 0;
        this.acceleration = 0.1;
        this.breakingPower = 0.2;
        this.maxSpeed = maxSpeed;
        this.minSpeed = minSpeed;
        this.friction = 0.001;

        this.angle = 0;
        this.dTheta = 0.003;
        this.damaged = false;

        this.useBrain=controlType=="AI";

        if(controlType !== "DUMMY"){
            this.sensor = new Sensor(this, 31, 300, Math.PI*2);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 25, 4]
            )
        }

        this.controls = new Controls(controlType);
    }
    
    //momentum!
    update(roadBorders, traffic)
    {
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon(); 
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            //console.log(outputs);
            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.reverse = outputs[1];
                this.controls.left = outputs[2];
                this.controls.right = outputs[3];
            }
        }

    }

    #assessDamage(roadBorders, traffic)
    {
        for(let i = 0;i<roadBorders.length;i++)
        {
            if(polysIntersect(this.polygon,roadBorders[i]))
            {
                return true;
            }
        }
        for(let i = 0;i<traffic.length;i++)
        {
            if(polysIntersect(this.polygon,traffic[i].polygon))
            {
                return true;
            }
        }
        return false;
    }

    #createPolygon()
    {
        const points = [];
        const radius = Math.hypot(this.width,this.height)/2;
        const theta = Math.atan2(this.width,this.height);
        //topRight
        points.push({
            x:this.x-Math.sin(this.angle-theta)*radius,
            y:this.y-Math.cos(this.angle-theta)*radius
        });
        //topLeft
        points.push({
            x:this.x-Math.sin(this.angle+theta)*radius,
            y:this.y-Math.cos(this.angle+theta)*radius
        });
        //bottomRight
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-theta)*radius,
            y:this.y-Math.cos(Math.PI+this.angle-theta)*radius
        });
        //bottomleft
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+theta)*radius,
            y:this.y-Math.cos(Math.PI+this.angle+theta)*radius
        });
        return points;

    }

    #move()
    {
        if(this.speed >= 0)
        {
            if (this.controls.forward) {
                //as y decreases, it goes up the screen
                this.speed += this.acceleration;
            }
            if (this.controls.reverse) {
                //as y increases, it goes down the screen
                this.speed -= this.breakingPower;
            }
        }else if(this.speed <= 0)
        {
            if (this.controls.reverse) {
                //as y decreases, it goes up the screen
                this.speed -= this.acceleration;
            }
            if (this.controls.forward) {
                //as y increases, it goes down the screen
                this.speed += this.breakingPower;
            }
        }


        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if (this.speed < this.minSpeed) this.speed = this.minSpeed;

        if (this.speed > 0) {
            this.speed -= this.friction * Math.abs(this.speed);
        }
        if (this.speed < 0) {
            this.speed += this.friction * Math.abs(this.speed);
        }
        if (Math.abs(this.speed) < this.friction) this.speed = 0; 

        /*
        if(this.controls.left)
        {
            //as x decreases, it goes left
            this.speedX += this.accelerationX;
        }
        if(this.controls.right)
        {
            //as x increases, it goes right
            this.speedX -= this.accelerationX;
        }

        if(this.speedX > this.maxSpeedX) this.speedX = this.maxSpeedX;
        if(this.speedX < this.minSpeedX) this.speedX = this.minSpeedX;

        if(this.speedX > 0)
        {
            this.speedX -= this.frictionX;
        }
        if(this.speedX < 0){
            this.speedX += this.frictionX;
        }
        if(Math.abs(this.speedX) < this.frictionX) this.speedX = 0;

        this.x -= this.speedX;   
        */

        //also cant turn when not moving!
        if(this.speed != 0){
            /*
            this makes it so the car doesnt flip its turning behavior when its in reverse
            without flip, when reversing, if you try to turn left it turns right
            */
            const flip = this.speed > 0 ? 1:-1;
            if(this.controls.left)
            {
                this.angle += this.dTheta*this.speed*flip;
            }
            if(this.controls.right)
            {
                this.angle -= this.dTheta*this.speed*flip;
            }
        }

        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx, color, drawSensor = false)
    {
        if(this.damaged)
        {
            ctx.fillStyle = "gray";
        }else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i = 1;i<this.polygon.length;i++)
        {
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor && drawSensor) this.sensor.draw(ctx);
    }
}
