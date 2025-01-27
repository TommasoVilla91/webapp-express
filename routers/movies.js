const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

// index
router.get("/", movieController.index);

// show
router.get("/:slug", movieController.show);


module.exports = router;