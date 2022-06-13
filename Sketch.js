const NUM_ROBOTS = 5
const ROBOTS = []

const WIDTH = 1920
const HEIGHT = 1080

const NUM_TASKS = 3
const TASKS = []

var SCORE = 0

function setup(){
    createCanvas(WIDTH/2, HEIGHT/2)
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
    scale(0.5)

    // Draw the tasks
    for(let i = 0; i < NUM_TASKS; i++){
        if (TASKS[i].is_complete(ROBOTS)) SCORE += TASKS[i].num
        if (TASKS[i].expired) TASKS[i] = new Task(random(4)+1)
        TASKS[i].draw()
    }

    // Draw the robots
    for(let r of ROBOTS){
        r.move(1)
        r.draw()
    }
}