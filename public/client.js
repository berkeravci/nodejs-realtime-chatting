// get nickname from cookie and set it to div at the top right corner
let nickname  = Cookies.get("nickname") ;
$("#nickname").text(nickname)

// io() is a function that returns a socket
// it connects to a socket io server
// if it has no parameter : "ws://localhost:3000" - current url address
let socket = io() ; // connnect to socket.io server

// send nickname to the socket.io server (associated socket in server)
socket.emit("set-nickname" , nickname) ;

// if you press "enter" after the text message
// it sends a "deliver-message" packet
// deliver-message is a user defined message type
$("#form").submit( function(e) {
    e.preventDefault() ;
    let msg = $("#input").val() ;
    if ( msg.trim().length !== 0) {
        // send message to the server, it will deliver this message to all clients
        socket.emit("deliver-message", {nickname, msg}) ;
    }
    $("#input").val("")
})

// register on "display-message" packet sent by the server.
socket.on("display-message", (data) => {
    // update message list
    $("#messages").append(`<li><b>${data.nickname}</b> : ${data.msg}</li>`)
})