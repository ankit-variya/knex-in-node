const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = 3000;
const posts = require('./controllers/postsActions');
const ratings = require('./controllers/ratingActions');
const api = require('./controllers/postActions');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

 app.use("/postapi/:action", api);
app.use('/api', posts);
app.use('/ratingapi', ratings);

const server = app.listen(port, () => {
    console.log('server started on:', port);
})
