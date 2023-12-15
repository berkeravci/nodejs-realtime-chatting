const express = require("express")
const app = express()

// take the http server where express is on top of it.
const http = require("http").Server(app) ; 

// socket.io server is attachted to the http server.
const io = require("socket.io")(http) ;

// deliver static files
app.use(express.static("public"))
// parse form data in x-www-urlencoded format
app.use(express.urlencoded({extended:true})) 

// post packet for root folder. (html web form sends this request)
app.post("/", (req, res) => {
    // save the nickname (req.body.nickname) 
    // sent by the form in a cookie (nickname)
    res.cookie("nickname", req.body.nickname) ;
    // redirect browser to "chat.html"
    // it sets http response packet to 302 and 
    // location : chat.html 
    res.redirect("/chat.html") ;
})

// Socket.io Server Configuration

// connection is a built-in event
// when the client (chat.html) sends a request for connection
// socket.io server gets this connection request, and creates a new
// socket that handles the client socket. (two sockets communicate with each other) 
io.on("connection", socket => {
     console.log("a new connection from a client")
    // set-nickname is a user-defined message type
    // server socket is registered on "set-nickname" message
    // set-nickname will be sent by "chat.html", server handles it.
    socket.on("set-nickname", nickname => {
        console.log("a client sent its nickname : " , nickname)
        // store nickname sent by client in the socket object.
        // make sure that you don't overwrite an existing property of socket object.
        // Symbol can be used here, to simplify the task, Symbol is not used.
        socket.nickname = nickname ;
    })

    // disconnect is a built-in event
    // Closing tab or browser entirely sends a disconnect message to the server
    socket.on("disconnect", () => {
         console.log(socket.nickname , " disconnected")
        // socket.broadcast.emit sends a message to all client sockets 
        // except itself. 
        socket.broadcast.emit("display-message", {nickname: socket.nickname, msg: " disconnected"})
    })

    // user-defined events : 
    // deliver-message coming from clients
    // display-message goes to all or specific sockets.
    socket.on("deliver-message", data => {
        // io.emit is used to send a message to all connected client sockets
        io.emit("display-message", data) ;
        console.log(data.nickname, " sent a message :" , data.msg) ;  // check the client "deliver-message" content
    })
})

http.listen(3000, () => {
    console.log("Listening at port 3000") ;
})