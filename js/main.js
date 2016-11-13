// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Common = Matter.Common,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;


// create an engine
var engine = Engine.create();
var world = World.create();
// create a renderer
var render = Render.create({
    element: document.getElementById('matter'),
    engine: engine,
});

render.options.showAngleIndicator = true;
engine.world.gravity.y = 0;
// create two boxes and a ground
var mask = 0x0001;
var mask1 = 0x0002;
var mask2 = 0x0004;
var boxA = Bodies.circle(400, 200, 10,{
    collisionFilter:{
        category: mask1
    }
});
var boxB = Bodies.circle(450, 200, 10,{
    collisionFilter:{
        category:mask1
    }
});
var boxC = Bodies.circle(500, 200, 10,{
    collisionFilter:{
        category: mask1
    }
});
var boxD = Bodies.rectangle(600, 200, 10,10,{
    collisionFilter:{
        category: mask2
    }
});

var mouse = Mouse.create(document.querySelector('canvas'));
// Mouse.setElement(mouse, document.getElementById('matter'));
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    collisionFilter: {
        mask : mask2
    }
});
// render.mouse = mouseConstraint.mouse;
// MouseConstraint.create(engine);
// 宽高是基于坐标点对称渲染，而不是顶点渲染
var ground = Bodies.rectangle(400, 600, 800, 20, { isStatic: true });
var ground1 = Bodies.rectangle(400, 0, 800, 20, { isStatic: true });
var ground2 = Bodies.rectangle(0, 300, 20, 600, { isStatic: true });
var ground3 = Bodies.rectangle(800, 300, 20, 600, { isStatic: true });

//以20，20坐标微机电，生成20列2行的bodys(由函数生成)
var stack = Composites.stack(20, 20, 20, 2, 0, 0, function (x, y) {
    return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
});
Constraint.bodyA = boxA;
Constraint.bodyB = boxB;



// add all of the bodies to the world
World.add(engine.world, [mouseConstraint,boxA, boxB, boxC,boxD, ground, ground1, ground2, ground3]);
// World.add(engine.world, mouseConstraint);
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);