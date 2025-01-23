const express = require("express");
const moviesRouter = require("./routers/movies");
const errorsHandler = require("./middleware/errorsHandler");
const unknownRoute = require("./middleware/unknownRoute");

const app = express();
const port = process.env.SERVER_PORT;

app.use("/movies", moviesRouter);
app.use(errorsHandler);
app.use(express.static("public"));
app.use(unknownRoute);

app.listen(port, () => {
    console.log(`listening on ${port}`);    
});