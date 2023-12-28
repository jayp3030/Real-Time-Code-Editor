const express = require('express')
const app = express();

const { Server } = require('socket.io');
const http = require('http'); 

const port = process.env.PORT || 8000

const server = http.createServer(app);
const io = new Server(server);

const userSocketObj = {};           // used to map username with socketID

const getAllConnectedUsers = (roomId) => {
   return Array.from( io.sockets.adapter.rooms.get(roomId) || []).map(      // Array.from() converts the map DS to array
    (socketId) => {
        return {
            socketId,
            userName : userSocketObj[socketId]
        }
   } );        
} 

io.on( 'connection' , (socket) =>{
    console.log('socket connected',socket.id)

    // listening on joining from client

    socket.on('join' , ({roomId , userName}) => {
        userSocketObj[socket.id] = userName
        socket.join(roomId);

        const users = getAllConnectedUsers(roomId);

        console.log(users);

        users.forEach(({socketId}) => {
            io.to(socketId).emit('joined',{
                users,
                userName,
                socketId : socket.id,
            });
        });
    })

    // listening on code change event from client

    socket.on('code-change' , ({roomId , code}) => {
        socket.in(roomId).emit('code-change' , { code })        // emit code-change to all roomId and sending code
    })

    // listening on disconnecting from client

    socket.on('disconnecting' , () => {
        const rooms = [...socket.rooms];
        console.log('rooms : ',rooms);

        rooms.forEach( (roomId) => {
            socket.in(roomId).emit('disconnected' , {
                socketId : socket.id,
                userName : userSocketObj[socket.id]
            })
        })

        delete userSocketObj[socket.id];    // removing user from joined user list because it will get disconnected
        // leaving the room 
        socket.leave();
    })


})






server.listen(port , () =>{
    console.log(`listening on port : ${port}`)
})