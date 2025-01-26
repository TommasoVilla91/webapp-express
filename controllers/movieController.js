const dbConnection = require("../data/dbConnection");

const index = (req, res, next) => {

    // estrazione filtri dalla query ?search=...
    const { title, genre, year } = req.query;

    // definire la query sql base
    let sql = "SELECT * FROM `movies`";

    // array che conterrà i parametri da sostituire nella query sql
    const params = [];
    // aray per gestire le clausole della ricerca dinamica
    const conditions = [];

    // se l'utente ha fornito un parametro title
    if (title) {
        // si inserisce la stringa di ricerca nell'array delle clausole
        conditions.push("`title` LIKE ?")

        // ed infine si inserisce questo nuovo parametro nell'array dei parametri
        params.push(`%${title}%`);
    }

    // se l'utente ha fornito un parametro genre
    if (genre) {
        // si inserisce la stringa di ricerca nell'array delle clausole 
        conditions.push("`genre` LIKE ?")

        // ed infine si inserisce questo nuovo parametro nell'array dei parametri
        params.push(`%${genre}%`);
    }

    // se l'utente ha fornito un parametro year
    if (year) {
        // si inserisce la stringa di ricerca nell'array delle clausole
        conditions.push("`release_year` LIKE ?")

        // ed infine si inserisce questo nuovo parametro nell'array dei parametri
        params.push(`%${year}%`);
    }
    // controllare se ci sono condizioni da applicare
    if (conditions.length > 0) {
        // se si, costruire stringa sql finale aggiungendo WHERE e AND tra le clausole  
        sql += " WHERE " + conditions.join(" AND ");
    }
    
    // aggiungere l'array params nell'esecuzione della query sql 
    dbConnection.query(sql, params, (err, movies) => {
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
  
    const sql = `
        SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS vote_avg 
        FROM movies 
        LEFT JOIN reviews
        ON reviews.movie_id = movies.id;
        WHERE movies.id = ?;
    `;
  
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
  
        if (movies.length === 0 || movies[0].id === null) {
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
                    reviews
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