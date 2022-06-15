const SIZE = (num) => sqrt(num) * 100 + 10
const TIME = (num) => num * 20000

var task_id_counter = 0

class Task{
    constructor(num_robots, TASKS){
        this.num = num_robots
        this.size = SIZE(num_robots)
        this.ID = task_id_counter++
        do{
            this.pos = createVector(
                random(WIDTH  - this.size*2) + this.size,
                random(HEIGHT - this.size*2) + this.size
            )
        } while (!TASKS.every(t => this.pos.dist(t.pos) > this.size + t.size))
        this.expired = false
        setTimeout(() => {
            this.expired = true
        }, TIME(this.num))
    }

    is_complete(robots){
        // Count how many robots are in the task area, true if enough
        if (robots.filter(x => x.pos.dist(this.pos) < this.size).length >= this.num){
            this.expired = true
            return true
        }
    }

    draw(){
        push()
        translate(this.pos.x, this.pos.y)

        fill(100,0,60)
        stroke(255)
        strokeWeight(3)
        circle(0, 0, this.size * 2)

        textSize(64)
        fill(0)
        noStroke()
        text(this.num, -20,20)

        pop()
    }

}