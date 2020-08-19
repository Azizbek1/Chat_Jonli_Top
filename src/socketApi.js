const socketio = require('socket.io');  // Socket IO  Bekend qismida Ishlavomiz  
const randomColors = require('../helper/randomColor');
const io = socketio();

const socketApi = {};
socketApi.io = io

const users = { }

io.on("connection", (socket) => {
    console.log("Foydalanuvchi bog'landi");

    socket.on("newUser", (data) => {
        // console.log(data);
        const defoultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color: randomColors()
        };
        const userData = Object.assign(data, defoultData)

        users[socket.id] = userData

        // console.log(users);

        socket.broadcast.emit("newUser", users[socket.id]) 

        socket.emit("initPlayers", users)


        socket.on('disconnect', () => {
            socket.broadcast.emit("disUser", users[socket.id])
            console.log(users);
            delete users[socket.id]
            console.log(users);
        })
    })

    socket.on("position", data => {
        // console.log(users);
        users[socket.id].position.x = data.x
        users[socket.id].position.y = data.y
        // console.log(users);

        socket.broadcast.emit("animate", {
            socketId: socket.id,
            x: data.x,
            y: data.y
        })

    })
    socket.on("newMessage", data => {
        // console.log(data);
        socket.broadcast.emit("newMessage", data)
    }) 

})


module.exports = socketApi

