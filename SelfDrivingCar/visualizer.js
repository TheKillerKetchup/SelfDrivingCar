class Visualizer{
    static drawNetwork(ctx,network)
    {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width-margin*2;
        const height = ctx.canvas.width-margin*2;

        const {levels} = network;
        const levelHeight = height/levels.length;

        for(let i = levels.length-1;i>=0;i--)
        {
            const levelTop = top+Visualizer.#getNodeX(levels,i,height-levelHeight,0);
            ctx.setLineDash([7,3]);
            Visualizer.drawLevel(ctx,levels[i],
                left,levelTop,
                width,levelHeight,
                i==network.levels.length-1
                    ?['\u2191', '\u2193', '\u2190', '\u2192']
                    :[]
            );
        }
    }
    static drawLevel(ctx, level, left, top, width, height, outputLabels,)
    {
        const right = left+width;
        const bottom = top+height;

        const nodeRadius = 10;
        const {inputs,outputs,weights,biases} = level;

        for(let i = 0;i<inputs.length;i++)
        {
            for(let j = 0;j<outputs.length;j++)
            {
                ctx.beginPath();
                ctx.moveTo(this.#getNodeX(inputs,i,left,right), bottom);
                ctx.lineTo(this.#getNodeX(outputs,j,left,right), top);

                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        for(let i = 0;i<inputs.length;i++)
        {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        for(let i = 0;i<outputs.length;i++)
        {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.stroke();

            if(outputLabels[i])
            {
                ctx.beginPath();
                ctx.textAlign="center";
                ctx.textBaseLine="middle";
                ctx.fillStyle="black";
                ctx.strokeStyle="white";
                ctx.font=(nodeRadius*1)+"px Arial";
                ctx.fillText(outputLabels[i], x, top+nodeRadius*0.18);
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.18);
            }
        }
    }
    
    static #getNodeX(nodes,index,left,right)
    {
        return lerp(
            left,
            right,
            nodes.length == 1?
                0.5
                :index/(nodes.length-1),
        )
    }
}