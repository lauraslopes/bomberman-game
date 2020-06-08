const roomRoute = require("./Room");

const RouteMap = {
    hanaRestService: {
        path: "/room",
        router: roomRoute
    },
};

function registerRoutes(app) {
    for (const route in RouteMap) {
        let routeOption = RouteMap[route];
        app.use(routeOption.path, routeOption.router);
    }
}

module.exports = {
    RouteMap,
    registerRoutes
};
