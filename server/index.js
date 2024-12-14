const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

const HTML_FILE = path.join(__dirname, '../', 'client', 'index.html');
const EVENTS_FILE = path.join(__dirname, 'events.json');

if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
}

app.use(express.static(path.join(__dirname, '../', 'client')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

app.post('/events', (req, res) => {
    const { id, message, time } = req.body;

    const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));

    events.push({ id, message, serverTime: new Date().toISOString(), clientTime: time });

    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));

    res.status(200).send({ status: 'success' });
});

app.get('/events', (req, res) => {
    const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));
    res.json(events);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});