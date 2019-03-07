const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/challenge', async (req, res) => {
    res.send({
        challenge: req.body.challenge,
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Billy Bot is running on port ${PORT}`);
});
