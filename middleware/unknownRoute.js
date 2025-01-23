const unknownRoute = (req, res, next) => {
    res.status(404).json({
        status: "Fail",
        message: "Route inesistente"
    });
};

module.exports = unknownRoute;