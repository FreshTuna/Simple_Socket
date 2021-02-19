const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine','ejs');

const rooms = { name :{}}

app.get('/', (req,res) =>{
    res.render('chat',{ rooms:rooms });
});

app.get('/:room', (req, res) => {
    res.render('room', { roomName: req.params.room })
})

app.post('/room', (req,res) => {
    rooms[req.body.room] = {users: {}};
    res.redirect(req.body.room)
})

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

    socket.on('type-message', (nickname) => {
        console.log("focused:",nickname);
        
        socket.broadcast.emit('typing-notifiaction', nickname);
    })

    socket.on('type-message-erase', () => {
        console.log("send-erase");
        socket.broadcast.emit('erase-notification',"hi");
        // console.log("sended");
    })
});

http.listen(3000 , () => {
    console.log("listening on *:3000");
});