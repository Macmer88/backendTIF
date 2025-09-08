import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.type('text/plain');
    res.status(200);
    res.send('HOla manga de gorreados!!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});