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
        let x = WIDTH*i/5 + WIDTH/10
        let y = random(HEIGHT - 100) + 50
        ROBOTS.push(new Robot(createVector(x, y)))
    }

    // Create initial tasks
    for(let i = 0; i < NUM_TASKS; i++){
        TASKS.push(new Task(random(4) + 1))
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
        // Scale by 4x
        scale(0.25)

        // Draw what the robot can see
        let seen = ROBOTS[i].sense(ROBOTS, TASKS)
        translate(p5.Vector.mult(ROBOTS[i].pos, -1))
        rotate(-ROBOTS[i].dir)
        for(let robot of seen.robots) robot.draw()
        for(let task of seen.tasks) task.draw()

        // Draw robot in the center
        fill(255)
        stroke(0)
        strokeWeight(3)
        circle(0,0,80)
        line(0,0,0,-40)

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
        if (TASKS[i].expired) TASKS[i] = new Task(random(4)+1)
        TASKS[i].draw()
    }

    // Draw the robots
    for(let r of ROBOTS){
        r.draw()
        if (!r.isTurning){r.move(1)}
        
    }
}