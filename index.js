const express=require('express'),
      mongoose=require('mongoose'),
      bodyparser=require('body-parser'),
      cors = require("cors")
const socketio=require('socket.io');
const http=require('http');
const requireLogin = require('./Middleware/requireLogin');
const PORT=process.env.PORT||5000;

      app=express();
      app.use(bodyparser.urlencoded({extended:true}));
      app.use(cors());

      app.use(express.json())
      app.use(require('./routes/Auth'));

      app.get('/test',requireLogin,(req,res)=>{
        res.send('secret page')
      })
const server=http.createServer(app);
const io=socketio(server);

      mongoose.connect('mongodb://localhost/ChatInReact',{useNewUrlParser: true,useUnifiedTopology: true })
        .then(()=>{
        console.log('databse connected')
        })     
        .catch(()=>{
            console.log(' database not connected')
        });

        io.on('connection',(socket)=>{

                socket.emit('testmessage',{text:"hello world"})
                
                socket.on('sendmessage',(data)=>{
                    console.log(data)
                    io.emit('message',(data))
                })
        })

    

       

    server.listen(PORT,(err)=>{
        if(err)
        console.log(err);
        else
        console.log('Server running on Port '+PORT)
    })