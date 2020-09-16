const express=require('express'),
      mongoose=require('mongoose'),
      bodyparser=require('body-parser'),
      cors = require("cors")
const socketio=require('socket.io');
const http=require('http');
const requireLogin = require('./Middleware/requireLogin');
const Messages=require('./Models/Messages');
const PORT=process.env.PORT||5000;

      app=express();
      app.use(bodyparser.urlencoded({extended:true}));
      app.use(cors());

      app.use(express.json())
      app.use(require('./routes/Auth'));
      app.use(require('./routes/user'))

      app.get('/test',requireLogin,(req,res)=>{
        res.send('secret page')
      })
const server=http.createServer(app);
const io=socketio(server);

//Local db connection
    //   mongoose.connect('mongodb://localhost/ChatInReact',{useNewUrlParser: true,useUnifiedTopology: true })
    //     .then(()=>{
    //     console.log('databse connected')
    //     })     
    //     .catch(()=>{
    //         console.log(' database not connected')
    //     });
//Remote db connection
mongoose.connect(process.env.MONGOURI,{useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log('databse connected')
})
.catch(()=>{
    console.log(' database not connected')
});

        app.get('/',(req,res)=>{
            res.send('Welcome to the Chat App Api')
        })

        app.get('/oldmessages/:room',(req,res)=>{
            console.log('aayaa............')
            Messages.find({room:req.params.room},(err,oldChat)=>{
                if(err)
                console.log(err)
                else{
                    console.log('oldChat : ')
                    res.json(oldChat)
                }
            })
        })
        io.on('connection',(socket)=>{

               socket.on('join',({id,friend,room},callback)=>{
                    
                console.log('join the room',room)
                    socket.join(room);
                    callback();
               })              
                socket.on('sendmessage',(data)=>{
                     console.log(data.room)
                    io.to(data.room).emit('message',(data))
                    const chat={
                        room:data.room,
                        sender:data.sender,
                        text:data.text
                    }
                    const Msg=new Messages(chat);

                    Msg.save()
                    .then(result=>{
                        console.log('message saved ')
                    })
                    .catch(err=>console.log(err))
                })
        })

    

       

    server.listen(PORT,(err)=>{
        if(err)
        console.log(err);
        else
        console.log('Server running on Port '+PORT)
    })