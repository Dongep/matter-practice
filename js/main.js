// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Common = Matter.Common, 
    Mouse = Matter.Mouse,
    MouseConstraint = Matter. MouseConstraint,   
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;
    

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.getElementById('matter'),
    engine: engine,
});
engine.world.gravity.y = 0;
var category1 = 0x0001,
    category2 = 0x0002;
var mouseConstraint = MouseConstraint.create(engine, {
    element: document.querySelector('canvas'),
    collisionFilter: {
        mask: category2
    }
});
// mouseConstraint.collisionFilter.mask = category2;
// render.mouse = mouseConstraint.mouse;
render.options.showAngleIndicator = true;
render.options.showVelocity = true;
// create two boxes and a ground




var ballA = Bodies.circle(400, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1
});
var ballB = Bodies.circle(450, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1
});
var ballC = Bodies.circle(500, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1
});

var ballW = Bodies.circle(500, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1
});

var boxA = Bodies.rectangle(500, 250, 10,200,{
    collisionFilter: {
        category:category2
    }
});
var boxB = Bodies.trapezoid(50, 300, 10, 500, 0.5 ,{
    isSensor: true,
    collisionFilter: {
        category:category2
    }
});

var constraint1 = Constraint.create({
    bodyA: ballW,
    bodyB: boxB,
    length: 50,
    stiffness: 1,
    render: {
        lineWidth: 0,
        strokeStyle: {
            color: '#000000'
        }
    }
})
var rod = Composite.create({
    bodies: [ballW,boxB],
    constraints: constraint1,
});

// Mouse.create();
Events.on(mouseConstraint, "mousemove", function (event) { 
    var mousePosition = event.mouse.position;
    Body.setAngle(boxB, '0.1')
 })
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

// add all of the bodies to the world
World.add(engine.world, [mouseConstraint,ballA, ballB,ballC,rod,ground, ground1, ground2, ground3]);
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);