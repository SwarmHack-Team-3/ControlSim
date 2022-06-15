const IP = 'localhost'
const PORT = '8880'
const socket = new WebSocket(`ws://${IP}:${PORT}`);

var server_connected = false

// Establish connection to server
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({"sim_hello":true}));
});

socket.addEventListener('message', function (event) {
    if (event.data == "CONN_OK"){
        server_connected = true
        console.log("Established connection to server!")
        return
    }
    let message = JSON.parse(event.data)

    // console.log(message)

    if ("get_robots" in message){
        socket.send(JSON.stringify({"got_robots": getRobots()}))
    }

    if ("get_ir" in message){
        let robot_id = message.get_ir
        socket.send(JSON.stringify({
            got_ir: robot_id,
            ir: ROBOTS[robot_id-1].sense_ir()
        }))
    }

    if ("set_leds_colour" in message){
        let robot_id = message.set_leds_colour 
        ROBOTS[robot_id-1].setLED(message.colour)
    }

    if ("set_motor_speeds" in message){
        let robot_id = message.set_motor_speeds
        ROBOTS[robot_id-1].vel_L = message.left
        ROBOTS[robot_id-1].vel_R = message.right
    }
});

function getRobots(){
    let reply = {}
    for(let i=0; i < NUM_ROBOTS; i++){
        // Find neighbours
        let nearby_robots = ROBOTS.filter((x, j) => x.pos.dist(ROBOTS[i].pos) < SENSING_DIST && i != j)
        let neighbours = {}
        nearby_robots.map((r) => {neighbours[r.ID] = {
            range: r.pos.dist(ROBOTS[i].pos) / 1000,
            bearing: rng_deg(p5.Vector.sub(r.pos, ROBOTS[i].pos).angleBetween(createVector(1, 0).rotate(ROBOTS[i].dir))),
            orientation: rng_deg(r.dir)
        }})
        // Find tasks
        let nearby_tasks = TASKS.filter((x, j) => x.pos.dist(ROBOTS[i].pos) < SENSING_DIST)
        let tasks = {}
        nearby_tasks.map((t) => {tasks[t.ID] = {
            range: t.pos.dist(ROBOTS[i].pos) / 1000,
            bearing: rng_deg(p5.Vector.sub(t.pos, ROBOTS[i].pos).angleBetween(createVector(1,0).rotate(ROBOTS[i].dir))),
            workers: t.num
        }})
        // Assemble reply for robot
        let robot = {
            orientation: rng_deg(ROBOTS[i].dir),
            neighbours,
            tasks
        }
        reply[i+1] = robot
    }
    return reply
}

function rng_deg(rads){
    let v = degrees(rads)
    return (((v%360) + 540) % 360)-180
}