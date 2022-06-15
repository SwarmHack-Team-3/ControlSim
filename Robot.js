const INTERVAL = 20
const TURN_SPEED = 0.08
const MAX_VELOCITY = 1

const SENSING_DIST = 300
const SENSOR_DIRS = [342, 306, 270, 210, 150, 90, 54, 18].map(x => x*3.1415926 / 180)
const ROBOT_RADIUS = 35
const WHEELBASE = 55

var robot_id_counter = 1

class Robot{
    constructor(pos){
        this.pos = pos
        this.dir = random(TWO_PI)
        this.ID = robot_id_counter++
        this.colour = color(0,0,0)

        this.vel_L = 0
        this.vel_R = 0
    }

    step(){
        this.move(this.vel_L, this.vel_R)
    }

    move(vL, vR){
        vL /= 100
        vR /= 100
        if(abs(vL - vR) < 0.01){
            // If the velocities are very similar, just go straight
            this.pos.add((createVector(MAX_VELOCITY, 0).rotate(this.dir).mult((vL+vR)/2)))
        } else {
            let radius = (WHEELBASE/2) * ((vR + vL) / (vR - vL))
            let angle = (1/WHEELBASE) * (vR - vL)
            let radVector = createVector(radius, 0).rotate(this.dir - HALF_PI)
            let center = p5.Vector.sub(this.pos, radVector)
            this.pos = p5.Vector.add(center, radVector.rotate(angle))
            this.dir += angle
        }

        this.pos.x = constrain(this.pos.x, ROBOT_RADIUS, WIDTH-ROBOT_RADIUS)
        this.pos.y = constrain(this.pos.y, ROBOT_RADIUS, HEIGHT-ROBOT_RADIUS)
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
        // LED
        fill(this.colour)
        strokeWeight(2)
        circle(0,0,30)

        // Sensor range
        noFill()
        circle(0,0,SENSING_DIST*2)
        
        strokeWeight(1)
        let ds = this.sense_ir().map(x => (4000 - x) / 100)
        for(let i = 0; i < 8; i++){
            push()
            rotate(SENSOR_DIRS[i])
            line(ROBOT_RADIUS,0,ds[i]+ROBOT_RADIUS,0)
            circle(ds[i]+ROBOT_RADIUS,0,5)
            pop()
        }
        
        pop()
    }

    sense(robots, tasks){
        let seen = {}
        seen.tasks = tasks.filter(x => x.pos.dist(this.pos) < SENSING_DIST)
        seen.robots = robots.filter(x => x.pos.dist(this.pos) < SENSING_DIST)
        return seen
    }

    sense_ir(){
        return SENSOR_DIRS.map((sensor) => {
            let theta = (this.dir + sensor)
            let north = -this.pos.y / sin(theta)
            let south = (HEIGHT - this.pos.y) / sin(theta)
            let east = (WIDTH - this.pos.x) / cos(theta)
            let west = -this.pos.x / cos(theta)            
            
            let true_dist = 2000

            for(let d of [north, south, east, west]){
                if (d > 0 && d < true_dist) true_dist = d
            }
            let sensor_noise = noise(frameCount/20, sensor) * 80 - 40
            true_dist += -ROBOT_RADIUS + sensor_noise
            return 4000 - constrain(true_dist, 0, 40)*100
        })
    }

    setLED(colour) {
        this.colour = color(colour)
    }

}
