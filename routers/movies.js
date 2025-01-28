const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

// index
router.get("/", movieController.index);

// show
router.get("/:slug", movieController.show);

// store di un libro
router.post("/", movieController.store);

// salvataggio recensione
router.post("/:id/reviews", movieController.storeReview);



module.exports = router;