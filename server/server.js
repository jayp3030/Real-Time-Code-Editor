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
})

server.listen(port , () =>{
    console.log(`listening on port : ${port}`)
})