const Express = require("express");

const Router = Express.Router();

const rooms = {
    players: ["Lucas", "Giullio", "Bruna"]
};

/* This handles a GET request */
/* http://localhost:3000/hanaRestService/ */
Router.get("/list", function(req, res, next) {
    /* This is an example of how to respond json for API requests */
    res.json(rooms);
});

/* This handles a GET request */
/* http://localhost:3000/hanaRestService/ */
Router.delete("/:id", function(req, res, next) {
    let id = req.params.id;
    let players = rooms.players;
    let index = players.indexOf(id);

    players.splice(index, 1);

    res.json(rooms);
});

/* This handles a POST request */
Router.post("/", function(req, res, next) {
    /* How to read values from POST */
    const id = req.body.id;
    rooms.players.push(id);
    res.json({
        status: "OK!"
    });
});

/* Below are examples of advanced routes i.e. hanaRestService/details
* You guys can read more here: https://expressjs.com/en/guide/routing.html
* */
/* http://localhost:3000/hanaRestService/details/25?name=EastHastings */
Router.get("/details/:id", function(req, res, next) {
    /* How to read values from URL  e.g: /details/25 */
    let id = req.params.id;  // 25

    res.json({
        pos: rooms.players.indexOf(id)
    });
});

module.exports = Router;
