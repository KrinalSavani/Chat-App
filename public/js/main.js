const chatform = document.getElementById("chat-form");
const chatmsg = document.querySelector(".chat-messages");
const roomname = document.getElementById("room-name");
const userlist = document.getElementById("users");

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

// console.log(username , room);    

const socket = io();

socket.emit("joinroom" , { username , room });

socket.on("roomusers",({room ,users })=>{
    outputroomname(room);
    outputuser(users);
})


socket.on("msg",(msg)=>{
    console.log(msg);
    outputmsg(msg);

    chatmsg.scrollTop = chatmsg.scrollHeight;
});

chatform.addEventListener("submit",(e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit("chatmsg",msg);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

});

function outputmsg(msg){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">${msg.text}</p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

function outputroomname(room){
    roomname.innerText = room;
}

function outputuser(users){
    userlist.innerHTML = 
    `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}