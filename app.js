const express = require("express");
const moviesRouter = require("./routers/movies");
const errorsHandler = require("./middleware/errorsHandler");
const unknownRoute = require("./middleware/unknownRoute");
const cors = require("cors");

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use("/movies", moviesRouter);
app.use(express.static("public"));
app.use(errorsHandler);
app.use(unknownRoute);

app.listen(port, () => {
    console.log(`listening on ${port}`);    
});