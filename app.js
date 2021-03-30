const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const expressWs = require('express-ws')(app)
const ExpressError = require('./expressError')

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/templates', express.static(__dirname + '/templates'));
app.use('/static', express.static(__dirname + '/static'));





app.use(express.urlencoded({
  extended: true
}))

nunjucks.configure("templates", {
    autoescape: true,
    express: app
  });
  

app.get('/', (req, res, next) => {
    res.render("index.html")
})



// CHAT ROOM ROUTES AND WEBSOCKETS


app.post('/chatRoom', async (req, res, next) => {
    try{
        const roomName = req.body.roomName
        const userName = req.body.userNmae
        if(roomName && userName){
            res.redirect(`/chatRoom/${roomName}/${userName}`)
        } else {
            throw new ExpressError('Error loading room', 404)
        }
    } catch(err){
        res.redirect('/')
        return next(err)
    }
})

app.get('/chatRoom/:room_name/:user_name', async (req, res, next) => {
    try{
        const roomName = req.params.room_name
        const userName = req.params.user_name
        res.render('chatRoom.html', { roomName, userName })
    } catch(err) {
        return next(err)
    }
})





app.ws('/chatRoom/:room_name/:user_name',  (ws, req) => {
    ws.on('message', (data) => {
        console.log(data)
        expressWs.getWss().clients.forEach(client => {
            if(client.readyState === 1){
                client.send(data)
            }
        })
    })
    ws.on('close', () => {
        expressWs.getWss().clients.forEach(client => {
            if(client.readyState === 1){
                client.send('user signed off')
            }
        })
    })
})




app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
  
    // pass the error to the next piece of middleware
    return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
res.status(err.status || 500);

return res.send({ err });
});


module.exports = app