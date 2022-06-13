const TURN_INTERVAL = 20
const TURN_SPEED = 0.08

class Robot{
    constructor(pos){
        this.pos = pos
        this.dir = 0
    }

    turn(deg){
        let turn_dir = deg < 0 ? -TURN_SPEED : TURN_SPEED
        let turnTask = setInterval(() => this.dir += turn_dir, TURN_INTERVAL)
        setTimeout(() => clearInterval(turnTask), Math.abs(deg / TURN_SPEED) * TURN_INTERVAL)
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

}