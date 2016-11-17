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
});
render.options.showAngleIndicator = true;
render.options.showVelocity = true;
render.options.wireframes = false;
Render.run(render);
var mouseConstraint = MouseConstraint.create(engine, {
    element: document.querySelector('canvas')
});




//创建Body
var body1 = Bodies.circle(200, 0, 20);
var body2 = Bodies.rectangle(400, 300, 30,30,{ isStatic: true});
var constraint1 = Constraint.create({
    bodyA: body1,
    bodyB: body2,
    length: 100,
    stiffness: 0.1,
})
// add all of the bodies to the world
World.add(engine.world, [mouseConstraint,body1,body2,constraint1]);
Engine.run(engine);