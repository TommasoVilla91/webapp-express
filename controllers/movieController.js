const dbConnection = require("../data/dbConnection");

const index = (req, res, next) => {

    const sql = "SELECT * FROM `movies`;";
    dbConnection.query(sql, (err, movies) => {
        if (err) {
            next(new Error("Errore interno del server"));
        };

        return res.status(200).json({
            status: "Success",
            data: movies
        });
    });
};

const show = (req, res, next) => {
    
    const id = req.params.id;

    const sql = "SELECT * FROM `movies` WHERE id = ?;";

    const reviewsSql = `
        SELECT reviews.*
        FROM reviews
        JOIN movies
        ON movies.id = reviews.movie_id
        WHERE reviews.id = ?;
    `;

    dbConnection.query(sql, [id], (err, movies) => {
        if (err) {
            next(new Error("Errore interno del server"));
        };

        if (movies.length === 0) {
            return res.status(404).json({
                message: "Film non trovato"
            });
        } else {
            dbConnection.query(reviewsSql, [id], (err, reviews) => {
                if(err) {
                    next(new Error("Errore interno del server"));
                };

                const movieReviews = {
                    ...movies[0],
                    reviews: reviews
                };

                return res.status(200).json({
                    status: "Success",
                    data: movieReviews
                });
            });
        };
    });
};

module.exports = {
    index,
    show
};