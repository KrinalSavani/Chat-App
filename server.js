const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatemsg = require("./utils/messages");
const { userjoin , getcurrentuser , userleave , getroomuser } = require("./utils/user");

const app = express();
const port = process.env.port || 3000;
const server = http.createServer(app);
const staticpath = path.join(__dirname,"./public")
const io = socketio(server);
const name = "chatcord";

app.use(express.static(staticpath));

io.on("connection",(socket)=>{
    // console.log("connection successfully");

    socket.on("joinroom",({ username , room })=>{

        const user = userjoin(socket.id,username,room);

        socket.join(user.room);

        socket.emit("msg",formatemsg(name,"Welcome.."));

        socket.broadcast.to(user.room).emit("msg",formatemsg(name,` ${user.username} Has Join The Chat`));

        io.to(user.room).emit("roomusers",{
            room : user.room,
            users : getroomuser(user.room)
        });
    });

    

    socket.on("chatmsg",(msg)=>{

        const user = getcurrentuser(socket.id);

        io.to(user.room).emit("msg",formatemsg(user.username,msg));
    })

    socket.on("disconnect",()=>{

        const user = userleave(socket.id);
        if(user){

            io.to(user.room).emit("msg",formatemsg(name,`${user.username} Has Left Chat`));

            io.to(user.room).emit("roomusers",{
                room : user.room,
                users : getroomuser(user.room)
            });
        }
    })
});

server.listen(port,()=>{
    console.log(`port listening at port no ${port}`);
});

