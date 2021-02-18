const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine','ejs');

app.get('/', (req,res) =>{
    res.render('chat');
});

io.on('connection', (socket) => {
    socket.on('enterance-message',(nickname) => {
        socket.broadcast.emit('chat-message',nickname + ' has entered');
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message',msg);
    });
});

http.listen(3000 , () => {
    console.log("listening on *:3000");
});