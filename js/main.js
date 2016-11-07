// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Common = Matter.Common, 
    Mouse = Matter.Mouse,
    MouseConstraint = Matter. MouseConstraint,   
    Bodies = Matter.Bodies;
    

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.getElementById('matter'),
    engine: engine,
});
engine.world.gravity.y = 0;
// create two boxes and a ground
var boxA = Bodies.circle(400, 200, 10);
var boxB = Bodies.circle(450, 200, 10);
var boxC = Bodies.circle(500, 200, 10);

// Mouse.create();
var mouseConstraint = MouseConstraint.create(engine, {
    element: render.element
});
render.mouse = mouseConstraint.mouse;
render.options.showAngleIndicator = false;
render.options.showVelocity = true;
// MouseConstraint.create(engine);
// 宽高是基于坐标点对称渲染，而不是顶点渲染
var ground = Bodies.rectangle(400, 600, 800, 20, { isStatic: true });
var ground1 = Bodies.rectangle(400, 0, 800, 20, { isStatic: true });
var ground2 = Bodies.rectangle(0, 300, 20, 600, { isStatic: true });
var ground3 = Bodies.rectangle(800, 300, 20, 600, { isStatic: true });
//以20，20坐标为基点，生成20列2行的bodys(由函数生成)
var stack = Composites.stack(20, 20, 20, 2, 0, 0, function(x, y) {
            return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
        });
Constraint.bodyA = boxA;
Constraint.bodyB = boxB;
// add all of the bodies to the world
World.add(engine.world, [boxA, boxB,boxC, ground, ground1, ground2, ground3]);

World.add(engine.world,mouseConstraint);
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);