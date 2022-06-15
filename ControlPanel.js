const VIEW_SIZE = 1000

const IP = 'localhost'
const PORT = '8880'
const socket = new WebSocket(`ws://${IP}:${PORT}`);

var robots = {}

// Open socket connection and declare as a controller
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({"ctrl_hello":true}));
});

socket.addEventListener('message', function (event) {
    let message = JSON.parse(event.data)
    console.log(message)
    robots = message
})

const get_robots = setInterval(() => socket.send(JSON.stringify({"get_robots": true})), 1000)

function setup(){
    createCanvas(VIEW_SIZE*3 / 2, VIEW_SIZE*2 / 2)
}

function draw(){
    background(51)
    scale(0.5)
    translate(VIEW_SIZE/2, VIEW_SIZE/2)

    for(let i in robots){
        let r = robots[i]
        push()
        translate(VIEW_SIZE*(i%3) - (i < 3 ? VIEW_SIZE/2 : 0), VIEW_SIZE*floor(i/3))
        rotate(radians(r.orientation))


        fill(255)
        stroke(0)
        strokeWeight(3)
        circle(0,0,ROBOT_RADIUS*2)
        line(0,0,ROBOT_RADIUS, 0)

        // agglomerate all things we can see
        // First check all the bots we can see
        let seenBots = []
        let seenTasks = []
        for(let bot in r.neighbours){
            if(!(bot in seenBots)){
                let pos = createVector(0, bot.range*1000).rotate(bot.heading)
                push()
                translate(pos.x, pos.y)
                rotate(bot.orientation)
                circle(0,0,ROBOT_RADIUS*2)
                line(0,0,ROBOT_RADIUS, 0)
                pop()
            }
        }
        pop()
    }
}

