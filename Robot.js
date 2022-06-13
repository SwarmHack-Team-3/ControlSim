const INTERVAL = 20
const TURN_SPEED = 0.08
const MAX_VELOCITY = 1

const SENSING_DIST = 300

class Robot{
    constructor(pos){
        this.pos = pos
        this.dir = 0
        this.isTurning = false;
    }

    turn(deg){
        let turn_dir = deg < 0 ? -TURN_SPEED : TURN_SPEED
        let turnTask = setInterval(() => this.dir += turn_dir, INTERVAL)
        setTimeout(() => {
            this.isTurning = true
            clearInterval(turnTask), Math.abs(deg / TURN_SPEED) * INTERVAL
            this.isTurning = false
        })
    }

    move(throttle){
        let move = createVector(MAX_VELOCITY*throttle,0).rotate(this.dir)
        this.pos.add(move)
    }

    draw(){
        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.dir)

        fill(255)
        stroke(0)
        strokeWeight(3)
        circle(0,0,80)
        line(0,0,40,0)
        
        pop()
    }

    sense(robots, tasks){
        let seen = {}
        seen.tasks = tasks.filter(x => x.pos.dist(this.pos) < SENSING_DIST)
        seen.robots = robots.filter(x => x.pos.dist(this.pos) < SENSING_DIST)
        return seen
    }

}
