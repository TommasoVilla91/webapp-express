const multer = require("multer");

// impostazioni salvataggio file immagine
const storage = multer.diskStorage({

    // impostazione posizione di salvataggio file immagine
    destination: (req, file, callbackfn) => {
        callbackfn(null, "public/movies_cover");
    },
    // definizione nome file
    filename: (req, file, callbackfn) => {
        
        // estrazione nome originale del file
        const originalName = file.originalname;
        
        // aggiungo timestamp al nome per renderlo unico
        const uniqueName = `${Date.now()}-${originalName}`;

        // funzione per impostare nuovo nome
        callbackfn(null, uniqueName);
    }
});

// istanza di multer passando le opzioni di salvataggio
const upload = multer({storage});

module.exports = upload;