const index = (req, res) => {
    res.json({
        message: "Index film"
    });
};

const show = (req, res) => {
    res.json({
        message: "Show film"
    });
};

module.exports = {
    index,
    show
};