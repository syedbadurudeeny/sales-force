const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const Connectdb = require('./dbConnection/connectDB');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./Models/conversationModel');

// Set up CORS options
const corsOptions = {
    origin: 'http://localhost:3000', // Allow frontend on localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

// Db connection
Connectdb();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too Many Requests from This IP, Please Try Again Later",
    statusCode: 429,
});

app.use(cors(corsOptions)); // Use CORS middleware here
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user/', require('./Routers/userRouter'));
app.use('/api/new/', require('./Routers/accountRouter'));
app.use('/api/store/v1', require('./Routers/dealsRouter'));
app.use('/api/store/v2', require('./Routers/salesRouter'));
app.use('/api/cases/v3',require('./Routers/casesRouter'));
app.use('/api/account/v4',require('./Routers/emailRouter'));

//report
app.use('/api/report/v5',require('./Routers/feedbackCaseRouter'));
app.use('/api/rating/v6',require('./Routers/feedbackRatingRouter'));


// Add this line in your server.js to use the route for fetching messages
app.use('/api/chat', require('./Routers/conversationRouter'));


// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // Same as frontend
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Set up Socket.io connection
io.on('connection', (socket) => {
    // console.log('A user connected');
    // Handle your message events here, e.g., sendMessage and receiveMessage
    socket.on('send_message', (message)=>{
        if(message){
            console.log("message :", message)
            let newMessage = new Message({
                user : message.user,
                date : message.date,
                discuss : message.discuss, 
                message : message.message
            });
            newMessage.save();
        }
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
