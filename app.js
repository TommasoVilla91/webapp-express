const express = require("express");
const moviesRouter = require("./routers/movies");

const app = express();
const port = process.env.SERVER_PORT;

app.use("/movies", moviesRouter);

app.listen(port, () => {
    console.log(`listening on ${port}`);    
});