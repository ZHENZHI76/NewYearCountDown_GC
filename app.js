require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const greetingsRouter = require('./api/greetings');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API 路由
app.use('/api', greetingsRouter);

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
