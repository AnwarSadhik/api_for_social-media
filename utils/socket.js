// import io from "socket.io";

const initializeSocketIO = () => (server) => {
    const io = require('socket.io')(server, {  cors: {
        origin: "*",
        credentials: true
      }
    });

    io.on("connection",(socket) => {

        socket.on('setup', (userId)=>{
            socket.userId = userId
            console.log("scoket setUp complete :" + userId)
          })

        socket.on("join",(chatId) => {
            socket.join(chatId);
        
        })

        socket.on('send message', (data) => {
            let {user, message, chatId} = data
           

            let chat = msgModel.create({user, message, chatId})
             
            io.to(data.chatId).emit('received message', data);



            
          });

    })

}

export default initializeSocketIO;