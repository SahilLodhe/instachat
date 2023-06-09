const express = require("express")
const { chats } = require("./data/data")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {notFound,errorHandler} = require('./middleware/errorMiddleware')
dotenv.config();
connectDB();
const app = express();
app.use(express.json());// to accept json data

app.get('/', (req, res) => {
    res.send("API is running");
});

// app.get('/api/chat', (req, res) => {
//     res.send(chats)
// });

// app.get('/api/chat/:id', (req, res) => {
//     const singleChat = chats.find((c) => c._id === req.params.id);
//     res.send(singleChat);
// });

app.use('/api/user',userRoutes) // all the logic related to the routes will be stored in the userRoutes file
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000
app.listen(5000,console.log(`Server started on PORT ${PORT}`.yellow))