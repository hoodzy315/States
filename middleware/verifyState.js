const verifyState = () => {
    return (req, res, next) => {
        if (!req?.params?.state) return res.sendStatus(404);
        const states = require('../model/States.json')
        const codeArr = states.map(state => state.code);
        const result = codeArr.includes(req.params.state.toUpperCase());
        if (!result) return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
        next();
    }
}

module.exports = verifyState