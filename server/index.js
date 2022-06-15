const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8880 });

const clients = {}
var simulator
const sendSim = (j) => {
    console.log("To Sim: ", j)
    simulator.send(JSON.stringify(j))
}

const get_queue = []

const ERR_NOT_INIT = JSON.stringify({"error": "Socket not yet associated with robot"})

wss.on('connection', (ws) => {
    clients[ws] = 0
    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        console.log(message)

        for(const [word, action] of Object.entries(actions)){
            // Check each action word
            if(word in message){
                // See if requirements are met
                console.log("Trying to run", word)
                console.log(ws.id)
                if(!action.needsSim  || simulator   !== undefined
                && !action.needsInit || ws.id !== undefined){
                    action.func(ws, message)
                    console.log("Ran", message)
                } else {
                    console.log("Failed to run", message)
                }
            }
        }
    })
})


const actions = {
    // Let a client select which robot to talk to
    "sel_robot" : {
        needsSim: false, needsInit: false,
        func: (ws, msg) => {
            const robot_id = msg.sel_robot

            // Close an existing socket for this robot if there was one
            if (clients.hasOwnProperty(robot_id)){
                clients[robot_id].terminate()
            }

            // Add this new client to the clients dict
            clients[robot_id] = ws

            // Save the id with the socket too
            ws.send(JSON.stringify({"ok": true}))
            ws.id = robot_id
            console.log("Set up", ws.id)
        }
    },

    // Let the simulator identify itself
    "sim_hello" : {
        needsSim: false, needsInit: false,
        func: (ws, msg) => {
            if(simulator) simulator.terminate()
            simulator = ws
            ws.send("CONN_OK")
        }
    },

    // ping command
    "check_awake" : {
        needsSim: true, needsInit: false,
        func: (ws, msg) => {
            ws.send(JSON.stringify({"awake": true}))
        }
    },

    // Get robot info from server
    "get_robots" : {
        needsSim: true, needsInit: false,
        func: (ws, msg) => {
            sendSim({"get_robots": true})
            get_queue.push(ws)
        }
    },

    // Get robot info from server
    "got_robots" : {
        needsSim: true, needsInit: false,
        func: (ws, msg) => {
            while(get_queue.length > 0){
                get_queue.pop().send(JSON.stringify(msg.got_robots))
            }
        }
    },

    // Get a robot's IR sensor status
    "get_ir" : {
        needsSim: true, needsInit: true,
        func: (ws, msg) => {
            sendSim({"get_ir": ws.id})
        }
    },

    // Get a robot's IR sensor status
    "got_ir" : {
        needsSim: true, needsInit: false,
        func: (ws, msg) => {
            console.log(msg)
            clients[msg.got_ir].send(JSON.stringify({
                ir: msg.ir
            }))
        }
    },

    // Get a robot's IR sensor status
    "reply_ir" : {
        needsSim: true, needsInit: false,
        func: (ws, msg) => {
            if (!(msg.reply_ir in clients)) return
            clients[msg.reply_ir].send(JSON.stringify({
                ir: msg.ir
            }))
        }
    },

    // Get a robot's battery (fake)
    "get_battery" : {
        needsSim: true, needsInit: true,
        func: (ws, msg) => {
            // clients[msg.reply_ir].send(JSON.stringify({
            //     ir: msg.ir
            // }))
        }
    },

    // Set a robot's LED colour
    "set_leds_colour" : {
        needsSim: true, needsInit: true,
        func: (ws, msg) => {
            sendSim({
                "set_leds_colour": ws.id,
                "colour": msg.set_leds_colour
            })
        }
    },

    // Set a robot's motor speeds
    "set_motor_speeds" : {
        needsSim: true, needsInit: true,
        func: (ws, msg) => {
            sendSim({
                "set_motor_speeds": ws.id,
                "left": msg.set_motor_speeds.left,
                "right": msg.set_motor_speeds.right
            })
        }
    },

}