// module aliases
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


// create an engine
var engine = Engine.create({
    enableSleeping: true
});
engine.world.gravity.y = 0;
var world = World.create();
// create a renderer
var render = Render.create({
    element: document.getElementById('matter'),
    engine: engine,
    showAngleIndicator: true,
    showVelocity: true
});

//物体的种类
var category1 = 0x0001,
    category2 = 0x0002,
    category3 = 0x0004;
//鼠标约束
var mouseConstraint = MouseConstraint.create(engine, {
    element: document.querySelector('canvas'),
    collisionFilter: {
        mask: category3
    }
});
// mouseConstraint.collisionFilter.mask = category2;
// render.mouse = mouseConstraint.mouse;
render.options.showAngleIndicator = true;
render.options.showVelocity = true;

//创建物体
var ballA = Bodies.circle(400, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1,
    friction: 0.05
});
var ballB = Bodies.circle(450, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1,
    friction: 0.05
});
var ballC = Bodies.circle(500, 200, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1,
    friction: 0.05
});

var ballW = Bodies.circle(500, 300, 10,{
    collisionFilter: {
        category:category1
    },
    restitution: 1,
    friction: 0.05,
    sleepThreshold: 0.1
});
// Body.setInertia(ballW, 1)
//球杆
var boxA = Bodies.trapezoid(50, 30, 10, 500, 0.5 ,{
    isSensor: true,
    collisionFilter: {
        category:category2
    }
});
//球杆中心点距离顶端的距离
var center = 500*(1 - 2 + Math.sqrt(2.5));

// var constraint1 = Constraint.create({
//     bodyA: ballW,
//     bodyB: boxB,
//     length: 50,
//     stiffness: 1,
//     render: {
//         lineWidth: 0,
//         strokeStyle: {
//             color: '#000000'
//         }
//     }
// })

// var rod = Composite.create({
//     bodies: [ballW,boxB],
//     constraints: constraint1,
// });

// Mouse.create();
function rod(ball,rod) { 
    var ballX = ball.position.x,
        ballY = ball.position.y;
    var positionX,positionY,clickX,clickY;//position球杆位置click点击位置
    var verctorRod={};//击球所用的力量和角度
    var mousemoveEvent = function (event) { 
        var mouseX = event.mouse.position.x-ballX,
            mouseY = event.mouse.position.y-ballY;
        var length = Math.sqrt(Math.pow(mouseX,2)+Math.pow(mouseY,2));
        var ratioX = (mouseX)/length,
            ratioY = (mouseY)/length; //斜边与另外两边的比例
        positionX = ballX - center*ratioX;
        positionY = ballY - center*ratioY;
        //计算移动点与球连线所成的角度（相对于y轴）
        var cos = mouseX/length;
        var angle = Math.acos(cos);
        if(mouseY < 0)
        {
            angle = Math.PI-angle+Math.PI;
        }
        angle = angle +Math.PI/2;
        Matter.Body.setPosition(rod, {
            x: positionX,
            y: positionY
        })
        Body.setAngle(rod, angle)
    }

    //蓄力函数，传入鼠标初始坐标点
    var forceEvent = function (event) { 
        var mouseX = event.mouse.position.x,
            mouseY = event.mouse.position.y;
        //初始点击点与球之间的距离
        var length = Math.sqrt(Math.pow(clickX-ballX,2)+Math.pow(clickY-ballY,2));
        //鼠标移动点与初始点击点之间的距离
        var length2 = Math.sqrt(Math.pow(mouseX-clickX,2)+Math.pow(mouseY-clickY,2));
        var ratioX = (clickX-ballX)/length,
            ratioY = (clickY-ballY)/length; 
        // var positionX = clickX-center*ratioX,
        //     positionY = clickY-center*ratioY;
        //计算初始点与球连线的角度(相对于x轴)
        // var cos = (clickX-ballX)/length;
        var angle = Math.acos(ratioX);
        if(ratioY < 0)
        {
            angle = Math.PI-angle+Math.PI;
        }
        // angle = angle + Math.PI/2;
        //计算移动点与初始点连线的角度(相对于x轴)
        var cos2 = (mouseX-clickX)/length2;
        var angle2 = Math.acos(cos2);
        if((mouseY - clickY) < 0)
        {
            angle2 = Math.PI-angle2+Math.PI;
        }
        // angle2 = angle2 + Math.PI/2 ;
        //计算在初始点与球连线延长线上移动的距离
        var moveLength = Math.cos(angle2 - angle)*Math.sqrt(Math.pow(mouseX-clickX,2)+Math.pow(mouseY-clickY,2));
        //计算球杆应该移动的坐标
        var rodMoveX = -moveLength* Math.cos(angle);
        var rodMoveY = -moveLength* Math.sin(angle);
        if(!isNaN(positionX-rodMoveX)&&!isNaN(positionY-rodMoveY))
        Matter.Body.setPosition(rod, {
            x: positionX-rodMoveX,
            y: positionY-rodMoveY
        });
        verctorRod={
            x: rodMoveX*0.0002,
            y: rodMoveY*0.0002           
        }
    }
    Events.on(mouseConstraint, "mousemove", mousemoveEvent);
    Events.on(mouseConstraint, "mousedown", function (event) { 
        clickX = event.mouse.position.x,
        clickY = event.mouse.position.y;
        Events.off(mouseConstraint, "mousemove",mousemoveEvent)
        Events.on(mouseConstraint, "mousemove",forceEvent);
    });
    Events.on(mouseConstraint, "mouseup", function (event) { 
        Events.on(mouseConstraint, "mousemove",mousemoveEvent);
        Events.off(mouseConstraint, "mousemove",forceEvent);
        Body.applyForce(ball, ball.position, verctorRod)
    });
    Events.on(ball, "sleepStart", function () { 

     })
     Events.on(ball, "sleepEnd", function () { 
        
     })
    
}
rod(ballW,boxA);


// MouseConstraint.create(engine);
// 宽高是基于坐标点对称渲染，而不是顶点渲染
var ground = Bodies.rectangle(400, 600, 800, 20, { isStatic: true,restitution:0.5 });
var ground1 = Bodies.rectangle(400, 0, 800, 20, { isStatic: true,restitution:0.5 });
var ground2 = Bodies.rectangle(0, 300, 20, 600, { isStatic: true,restitution:0.5 });
var ground3 = Bodies.rectangle(800, 300, 20, 600, { isStatic: true,restitution:0.5 });
// add all of the bodies to the world

// add all of the bodies to the world
World.add(engine.world, [mouseConstraint,ballA, ballB,ballC,ballW,boxA,ground, ground1, ground2, ground3]);
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);