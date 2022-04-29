const {GetCovidDataByDate} = require("./database");

async function getDataByDate(req, response) {
    if (req.params.date) {
        // Get article by state
        GetCovidDataByDate(req.params.date).then((data) => {
            if (data === null) {
                response.status(404).send({data: []})
                return
            }
            response.send(data);
        })
    } else {
        response.sendStatus(400);
    }
}

module.exports = (app) => {
    app.get("/data/:date", getDataByDate)
}