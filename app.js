const express = require("express");
const moviesRouter = require("./routers/movies");
const errorsHandler = require("./middleware/errorsHandler");

const app = express();
const port = process.env.SERVER_PORT;

app.use("/movies", moviesRouter);
app.use(errorsHandler);

app.listen(port, () => {
    console.log(`listening on ${port}`);    
});