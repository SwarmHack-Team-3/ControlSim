const NUM_ROBOTS = 5
const ROBOTS = []

const WIDTH = 1920
const HEIGHT = 1080
const VIEW_SIZE = WIDTH / NUM_ROBOTS/2

const NUM_TASKS = 3
const TASKS = []

var SCORE = 0

function setup(){
    createCanvas(WIDTH/2, HEIGHT/2 + VIEW_SIZE)
    background(51)

    // Initialize robots spread across the board
    for(let i = 0; i < NUM_ROBOTS; i++){
        let x,y,v
        do {
            x = (random(WIDTH - ROBOT_RADIUS*2) + ROBOT_RADIUS)
            y = (random(HEIGHT - ROBOT_RADIUS*2) + ROBOT_RADIUS)
            v = createVector(x, y)
        } while (!ROBOTS.every(x => x.pos.dist(v) > ROBOT_RADIUS*2))

        ROBOTS.push(new Robot(v))
    }

    // Create initial tasks
    for(let i = 0; i < NUM_TASKS; i++){
        TASKS.push(new Task(floor(random(5)) + 1, TASKS))
    }
}

function draw(){
    background(51)

    // --== Draw individual views ==--
    push()
    stroke(0)
    strokeWeight(5)
    line(0,HEIGHT/2, WIDTH/2, HEIGHT/2)
    for(let i = 0; i < NUM_ROBOTS; i++){
        // Move to the right view cell
        push()
        translate(VIEW_SIZE*i, HEIGHT/2)
        // Draw edge
        strokeWeight(5)
        line(0, 0, 0, VIEW_SIZE)
        // Move to center of cell
        translate(VIEW_SIZE/2, VIEW_SIZE/2)
        // Scale down
        scale(0.2)
        // Rotate to point upwards
        rotate(-HALF_PI)

        // Draw what the robot can see
        let seen = ROBOTS[i].sense(ROBOTS, TASKS)
        push()
        // Rotate to match the robot's perspective
        rotate(-ROBOTS[i].dir)
        translate(p5.Vector.mult(ROBOTS[i].pos, -1))
        for(let task of seen.tasks) task.draw()
        for(let robot of seen.robots) robot.draw()
        pop()

        // Draw robot in the center
        fill(255)
        stroke(0)
        strokeWeight(3)
        circle(0,0,80)
        line(0,0,40,0)
        stroke(255)
        strokeWeight(1)
        noFill()
        circle(0,0,SENSING_DIST*2)

        pop()
    }


    // --== Draw simulated board ==--
    pop()
    scale(0.5)
    // Fill in background
    noStroke()
    fill(51)
    rect(0,0,WIDTH, HEIGHT)
    // Draw the tasks
    for(let i = 0; i < NUM_TASKS; i++){
        if (TASKS[i].is_complete(ROBOTS)) SCORE += TASKS[i].num
        if (TASKS[i].expired) TASKS[i] = new Task(floor(random(5))+1, TASKS)
        TASKS[i].draw()
    }

    // Draw the robots
    for(let r of ROBOTS){
        r.draw()
        // r.move(100,80)
        r.step()
    }

    // noLoop()
}