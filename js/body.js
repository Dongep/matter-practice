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
Render.run(render);
var mouseConstraint = MouseConstraint.create(engine, {
    element: document.querySelector('canvas')
});



//通用设置
var ballOption = {
    restitution: 0.5, //弹性
    friction: 0.05,//摩擦力
    frictionAir: 0.01,//空气阻力
}
var groundOption = { isStatic: true,restitution: 1};

//创建Body
var body1 = Bodies.circle(200, 0, 10,ballOption);
var body2 = Bodies.rectangle(650, 0, 30,30,ballOption);
var ground = Bodies.rectangle(400, 590, 800, 20, {
     isStatic: true, //是否设置为静态物体
     restitution: 0.5
});
var ground1 = Bodies.rectangle(200, 400, 300, 20,{ 
    isStatic: true,
    restitution: 0.1,
    angle: 0.5 //弧度
});

var ground2 = Bodies.rectangle(600, 400, 300, 20,{ 
    isStatic: true,
    restitution: 0.1,
    angle: Math.PI-0.5
});
// add all of the bodies to the world
World.add(engine.world, [mouseConstraint,body1,body2,ground, ground1, ground2]);
Engine.run(engine);