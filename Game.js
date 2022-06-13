const SIZE = (num) => sqrt(num) * 100
const TIME = (num) => num * 20000

class Task{
    constructor(num_robots){
        this.num = num_robots
        this.size = SIZE(num_robots)
        this.pos = createVector(
            random(WIDTH  - this.size*2) + this.size,
            random(HEIGHT - this.size*2) + this.size
        )
        this.expired = false
        setTimeout(() => this.expired = true, TIME(num_robots))
    }

    is_complete(robots){
        // Count how many robots are in the task area, true if enough
        if (robots.filter(x => x.pos.dist(this.pos) < this.size).length > this.num){
            this.expired = true
            return true
        }
    }

    draw(){
        push()
        translate(this.pos.x, this.pos.y)

        fill(100,0,60)
        stroke(0)
        strokeWeight(1)
        circle(0, 0, this.size * 2)

        textSize(32)
        text(this.num, )

        pop()
    }

}