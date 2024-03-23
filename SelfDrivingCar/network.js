class NeuralNetwork{
    constructor(neuronCounts)
    {
        this.levels = [];
        for(let i = 0;i<neuronCounts.length-1;i++)
        {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]
                ));
        }
    }
    
    static feedForward(givenInputs,network)
    {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for(let i = 1;i<network.levels.length;i++)
        {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }
    
    static mutate(network, amount=1)
    {
        network.levels.forEach(level => {
            for(let i = 0;i<level.biases.length;i++)
            {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount,
                )
            }
            for(let i = 0;i<level.inputs.length;i++)
            {
                for(let j=0;j<level.outputs.length;j++)
                {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    );
                }
            }
        });
    }
    
    static crossOver(network1, network2, dominance2)
    {
        let network = network1;
        for(let l = 0;l<network1.levels.length;l++)
        {
            const level = network.levels[l];
            const level1 = network1.levels[l];
            const level2 = network2.levels[l];
            for(let i = 0;i<level1.biases.length;i++)
            {
                level.biases[i] = lerp(
                    level1.biases[i],
                    level2.biases[i],
                    dominance2
                )
            }
            
            for(let i = 0;i<level1.inputs.length;i++)
            {
                for(let j = 0;j<level1.outputs.length;j++)
                {
                    level.weights[i][j] = lerp(
                        level1.weights[i][j],
                        level2.weights[i][j],
                        dominance2
                    );
                }
            }
        }
        return network;
    }
}

class Level{
    //couldnt you also make this an array of objects, and each object is a neuron
    constructor(inputCount, outputCount)
    {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i = 0;i<inputCount;i++)
        {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }
    
    //it's static to "serialize". what is that?
    //its like finalizing it before packaging
    static #randomize(level)
    {
        for(let i = 0;i<level.outputs.length;i++)
        {
            level.biases[i] = Math.random()*2-1;
            for(let j = 0;j<level.inputs.length;j++)
            {
                //random value between -1,1
                level.weights[j][i] = Math.random()*2-1;
            }
        }
    }
    static feedForward(givenInputs, level)
    {
        for(let i = 0;i<level.inputs.length;i++)
        {
            level.inputs[i] = givenInputs[i];
        }

        for(let i = 0;i<level.outputs.length;i++)
        {
            let sum = 0;
            for(let j = 0;j<level.inputs.length;j++)
            {
                sum += level.inputs[j]*level.weights[j][i];
            }
            if(sum > level.biases[i])
            {
                level.outputs[i] = 1;
            }else{
                level.outputs[i] = 0;
            }
        }
        
        return level.outputs;
    }
}
