const dbConnection = require("../data/dbConnection");

const index = (req, res, next) => {

    // estrazione filtri dalla query ?title=...
    const { title } = req.query;

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
    };
    
    // // se l'utente ha fornito un parametro genre
    // if (genre) {
    //     // si inserisce la stringa di ricerca nell'array delle clausole 
    //     conditions.push("`genre` LIKE ?")

    //     // ed infine si inserisce questo nuovo parametro nell'array dei parametri
    //     params.push(`%${genre}%`);
    // }

    // // se l'utente ha fornito un parametro year
    // if (year) {
    //     // si inserisce la stringa di ricerca nell'array delle clausole
    //     conditions.push("`release_year` LIKE ?")

    //     // ed infine si inserisce questo nuovo parametro nell'array dei parametri
    //     params.push(`%${year}%`);
    // }

    for (const key in req.query) {
        if (key != "title") {
            conditions.push(`${key} = ?`);
            params.push(req.query[key]);
        };
    };

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
    
    const slug = req.params.slug;
    
    // definisco sql aggiungento il voto medio delle recensioni
    const sql = `
        SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS vote_avg 
        FROM movies 
        LEFT JOIN reviews
        ON reviews.movie_id = movies.id
        WHERE movies.slug = ?;
    `;
    
    // definisco sql per avere anche le recensioni
    const reviewsSql = `
        SELECT reviews.*
        FROM reviews
        JOIN movies
        ON movies.id = reviews.movie_id
        WHERE movies.slug = ?;
    `;
    
    // eseguo la sql aggiungendo l'array delle dipendenze per l'id
    dbConnection.query(sql, [slug], (err, movies) => {
        if (err) {
            next(new Error("Errore interno del server"));
        };
        
        // se l'array del risultato è vuoto o null allora errore 404
        if (movies.length === 0 || movies[0].id === null) {
            return res.status(404).json({
                message: "Film non trovato"
            });
        } else {
            // sennò altra connessione
            dbConnection.query(reviewsSql, [slug], (err, reviews) => {
                if(err) {
                    next(new Error("Errore interno del server"));
                };
                // creo oggetto con gli elementi richiesti dalla query + le reviews
                const movieReviews = {
                    ...movies[0],
                    reviews
                };
                // ritorno con gli elementi richiesti
                return res.status(200).json({
                    status: "Success",
                    data: movieReviews
                });
            });
        };
    });
};

const storeReview = (req, res, next) => {

    const id = req.params.id;

    // destrutturazione dei dati necessari del body della richiesta
    // impostare esempio sul postman
    const {name, vote, text} = req.body;

    // condizione che controlla che il numero inserito sia tra 0 e 5
    if (isNaN(vote) || vote < 0 || vote > 5) {
        return res.status(400).josn ({
            status: "fail",
            message: "Il voto deve essere un numero compreso tra 0 e 5"
        });
    };
    // condizione che controlla che il nome sia abbastanza lungo 
    if (name.length < 3) {
        return res.status(400).josn ({
            status: "fail",
            message: "Il nome deve essere di almeno 3 caratteri"
        });
    };

    // prima della query, assicurarsi che esista effettivamente il libro con quel id 
    const movieSql = `
        SELECT *
        FROM movies
        WHERE id = ?;
    `;
    // eseguo connessione 
    dbConnection.query(movieSql, [id], (err, movies) => {
        if (err) {
            next(new Error("Errore interno del server"));
        };
        // se trova il film con quel id 
        if (movies.length === 0) {
            return res.status(404).json ({
                status: "fail",
                message: "Film non trovato"
            });
        };

        // SE quindi l'id è stato trovato allora impostare query sql per dire al db di inserire dentro le colonne tra parentesi i dati che poi l'utente inserirà
        // inserisco tanti ? quante le colonne tra parentesi
        const sql = `
            INSERT INTO reviews(movie_id, name, vote, text)
            VALUES (?, ?, ?, ?);
        `;
        // nella connessione tra le quadre inserisco tutte le colonne in ordine come le ho scritte sopra
        dbConnection.query(sql, [id, name, vote, text], (err, movies) => {
            if (err) {
                next(new Error("Errore query database"));
            };
    
            return res.status(201).json({
                status: "success",
                message: "Recensione aggiunta con successo"
            });
        });
    });
};

const store = (req, res, next) => {

};

module.exports = {
    index,
    show,
    storeReview,
    store
};