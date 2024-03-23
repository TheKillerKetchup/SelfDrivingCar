class Road{
    constructor(x,width, laneCount=3)
    {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        
        this.left = x-width/2;
        this.right = x+width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        //homework -> make a roundabout border
        const topLeft = {x:this.left,y:this.top};
        const bottomLeft = {x:this.left,y:this.bottom};
        const topRight = {x:this.right,y:this.top};
        const bottomRight = {x:this.right,y:this.bottom};

        
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
        

        /*
        //homework -> make a different border
        this.length = 200;
        this.degrees = 45;
        this.borders = [

        ];
        let prevVertex = {x:400+this.length, y:400};
        for(let i = 0;i<=8;i++)
        {
            const radians = this.degrees * (Math.PI / 180) * i;
            const x = this.length*Math.cos(radians) + 400;
            const y = this.length*Math.sin(radians) + 400;
            console.log(x);
            console.log(y)
            const currVertex = {x:x, y:y};
            this.borders.push([prevVertex, currVertex]);
            prevVertex = currVertex;
        }
        (ITS AN OCTAGON!)
        */
    }

    getLaneCenter(laneIndex)
    {
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2+
        Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx)
    {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for(let i = 1;i<=this.laneCount-1;i++)
        {
            const x = lerp(
                this.left, 
                this.right,
                i/this.laneCount
            );

            ctx.setLineDash([20, 20]);

            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        //console.log(this.borders);
        this.borders.forEach(border =>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        })
    }
}