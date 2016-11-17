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
//重力为0
engine.world.gravity.y = 0;
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
World.add(engine.world, mouseConstraint);



//球的通用设置
var ballOption = {
    collisionFilter: {
        category:category1
    },
    restitution: 1,
    friction: 0.05,
    frictionAir: 0.01,
}
//计算初始时球的相对位置
function ballrelativeTop(position) { 
    return {
        x: position.x+17.32,
        y: position.y+10
    }
}
function ballrelativeBot(position) { 
    return {
        x: position.x+17.32,
        y: position.y-10
    }
}

//计算所有球的初始摆放位置
function ballPosition(balls) {
    var ballsTem = [];
    for( let i = 0;i < balls.length; i++ )
    {
        if(i==0){
            ballsTem.push(ballrelativeTop(balls[i]));
            ballsTem.push(ballrelativeBot(balls[i]));
        }
        else{
            ballsTem.push(ballrelativeBot(balls[i]));
        }
    }
    ballinit = ballinit.concat(ballsTem);
    if(ballsTem.length < 4){
        ballPosition(ballsTem)
    }
    else{
        ballPlace(ballinit);
    }
}
//摆放球
function ballPlace(position) {
    for( let i = 0;i < position.length; i++ ) {
        let ball = Bodies.circle(position[i].x, position[i].y,9,ballOption);
        console.log(ball)
        World.add(engine.world, ball);
    }
}
//设置普通球的初始位置
// var ballinit = [{
//     x:600,
//     y:300
// }];
// ballPosition(ballinit);






// 球杆与鼠标的关联事件
function rod(ball,rod) { 
    //球杆中心点距离顶端的距离
    var center = 500*(1 - 2 + Math.sqrt(2.5));
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
        Body.setPosition(rod, {
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
        //计算初始点与球连线的角度(相对于x轴)
        var angle = Math.acos(ratioX);
        if(ratioY < 0)
        {
            angle = Math.PI-angle+Math.PI;
        }
        //计算移动点与初始点连线的角度(相对于x轴)
        var cos2 = (mouseX-clickX)/length2;
        var angle2 = Math.acos(cos2);
        if((mouseY - clickY) < 0)
        {
            angle2 = Math.PI-angle2+Math.PI;
        }
        //计算在初始点与球连线延长线上移动的距离
        var moveLength = Math.cos(angle2 - angle)*Math.sqrt(Math.pow(mouseX-clickX,2)+Math.pow(mouseY-clickY,2));
        //计算球杆应该移动的坐标
        var rodMoveX = -moveLength* Math.cos(angle);
        var rodMoveY = -moveLength* Math.sin(angle);
        if(!isNaN(positionX-rodMoveX)&&!isNaN(positionY-rodMoveY))
        Body.setPosition(rod, {
            x: positionX-rodMoveX,
            y: positionY-rodMoveY
        });
        verctorRod={
            x: rodMoveX*0.0002,
            y: rodMoveY*0.0002           
        }
        
        
    }
    Events.on(mouseConstraint, "mousedown", function (event) { 
        clickX = event.mouse.position.x,
        clickY = event.mouse.position.y;
        Events.off(mouseConstraint, "mousemove",mousemoveEvent)
        Events.on(mouseConstraint, "mousemove",forceEvent);
    });
    Events.on(mouseConstraint, "mouseup", function (event) { 
        Events.on(mouseConstraint, "mousemove",mousemoveEvent);
        Events.off(mouseConstraint, "mousemove",forceEvent);
        if(verctorRod.x&&verctorRod.y)
        {
            Body.applyForce(ball, ball.position, verctorRod)         
        }
    });
    Events.on(ball, "sleepStart", function () { 
        ballX = ball.position.x,
        ballY = ball.position.y;
        verctorRod={};
        Events.on(mouseConstraint, "mousemove", mousemoveEvent);
     })
     Events.on(ball, "sleepEnd", function () { 
        Events.off(mouseConstraint, "mousemove",mousemoveEvent)
     })
    
}

//白球
var ballW = Bodies.circle(200, 300, 9,{
    collisionFilter: {
        category:category1
    },
    render: {
        fillStyle : '#ffffff',
        strokeStyle : '#000000',
    },
    restitution: 1,
    friction: 0.05,
    frictionAir: 0.01,
});

//球杆
var boxA = Bodies.trapezoid(50, 300, 10, 500, 0.5 ,{
    isSensor: true,
    collisionFilter: {
        category:category2
    }
});
// rod(ballW,boxA);
// World.add(engine.world, [ballW,boxA]);


// 球桌边界
var groundOption = { isStatic: true,restitution: 1};
var ground = Bodies.rectangle(400, 600, 800, 20, groundOption);
var ground1 = Bodies.rectangle(400, 0, 800, 20, groundOption);
var ground2 = Bodies.rectangle(0, 300, 20, 600, groundOption);
var ground3 = Bodies.rectangle(800, 300, 20, 600, groundOption);
//球洞
function hole(){
    for(let i = 0;i<6;i++)
    {
        let y = 20;
        let x = 380*i + 20;
        if(i>=3)
        {
            y = 580;
            x = 380*(i-3) + 20
        }
        
        let hole = Bodies.circle(x, y, 12 ,{
            isSensor: true,
            render: {
                fillStyle: '#000000',
                strokeStyle: 'transparent'
            }
        });
        World.add(engine.world, hole);
        Events.on(engine, "collisionStart", function (event) { 
            let pairs = event.pairs;
            console.log(pairs)
        })
    }
}

// World.add(engine.world, [ground, ground1, ground2, ground3]);
// hole();




// add all of the bodies to the world

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);