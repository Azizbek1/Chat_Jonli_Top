const socketio = require('socket.io');  // Socket IO  Bekend qismida Ishlavomiz  
const io = socketio();

const socketApi = {};
socketApi.io = io

// const users = []

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

        // console.log(userData);
        // users.push(userData)

        socket.broadcast.emit("newUser", userData) 

    })
})


module.exports = socketApi

