const socketio = require('socket.io');  // Socket IO  Bekend qismida Ishlavomiz  
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
            }
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
})


module.exports = socketApi

