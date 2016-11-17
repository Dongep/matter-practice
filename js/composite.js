// 缩写
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Common = Matter.Common,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Body = Matter.Body,
    Bodies = Matter.Bodies;


// 引擎
var engine = Engine.create({
    enableSleeping: true,
});

//创建模拟物理世界
var world = World.create();
// 渲染器
var render = Render.create({
    element: document.getElementById('matter'),
    engine: engine,
    width: 800,
    height: 600,
    // showAngleIndicator: true,
    // showVelocity: true,
    wireframes: true,
});
render.options.showAngleIndicator = true;
render.options.showVelocity = true;
render.options.wireframes = false;
Render.run(render);

var mouseConstraint = MouseConstraint.create(engine, {
    element: document.querySelector('canvas')
});


var ground = Bodies.rectangle(400, 600, 800, 20, {
    isStatic: true,
    restitution: 0.1,
});
// add all of the bodies to the world
World.add(engine.world, [ground, mouseConstraint]);
//通用设置
var particleOptions = {
    friction: 0.05,
    frictionStatic: 0.1
};

// add all of the bodies to the world
World.add(engine.world, [
    Composites.softBody(250, 100, 5, 5, 0, 0, true, 18, particleOptions),
    Composites.softBody(400, 300, 8, 3, 0, 0, true, 15, particleOptions),
    Composites.softBody(250, 400, 4, 4, 0, 0, true, 15, particleOptions)
]);
Engine.run(engine);