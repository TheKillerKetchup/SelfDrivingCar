const window2 = window.innerWidth/2;
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window2;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = window2-100;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9,10);

const n = 1;
let cars = generateCars(n);
let bestCar = cars[0];
/*
if(localStorage.getItem("bestBrain1"))
{
    const bestBrain1 = JSON.parse(
        localStorage.getItem("bestBrain1")
    );
    const bestBrain2 = localStorage.getItem("bestBrain2") ? 
        JSON.parse(localStorage.getItem("bestBrain2"))
        :null;
    if(bestBrain2) cars[1].brain = bestBrain2;
    cars[0].brain = bestBrain1;
    if (bestBrain2) 
    {
        for(let i = 2;i<cars.length/2;i++){
            cars[i].brain = NeuralNetwork.crossOver(bestBrain1,bestBrain2, 0.3);
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
    for(let i = cars.length/2;i<cars.length;i++)
    {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain1")
        );
        NeuralNetwork.mutate(cars[i].brain,0.2);
    }
    //
}
*/


const traffic = [
    new Car(road.getLaneCenter(0),-100,30,50, "DUMMY", 6),
    new Car(road.getLaneCenter(1),-300,30,50, "DUMMY", 6),
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY", 6)
];

animate();

function generateCars(n)
{
    const cars = [];
    for(let i = 1;i<=n;i++)
    {
        let next = new Car(road.getLaneCenter(1),100,30,50,"KEYS");
        cars.push(next);
    }
    return cars;
}

function save(index)
{
    localStorage.setItem("bestBrain"+index,
        JSON.stringify(bestCar.brain));
}

function discard(index)
{
    localStorage.removeItem("bestBrain" + index);
}

function animate(time)
{
    for(let i = 0;i<traffic.length;i++)
    {
        traffic[i].update(road.borders, []);
    }
    for(let i = 0;i<cars.length;i++)
    {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0;i<traffic.length;i++)
    {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha=0.2;
    for(let i = 0;i<cars.length;i++)
    {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time*0.02;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    //this is basically looping itself
    requestAnimationFrame(animate);
}