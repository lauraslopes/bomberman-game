/**
 *
 * @type {Game[]}
 */
const games = [];
/**
 *
 * @param {Socket} socket
 * @constructor
 */
module.exports = function handleGame(socket) {
    console.log('a user connected');
    let game = games.find(game => game.hasPlayer(socket.id)) || games.find(game => !game.isFull());

    if (game) {
        console.log("game found");
        game.addPlayer(socket);
    } else {
        console.log("game created");
        game = new Game();
        game.addPlayer(socket);
        games.push(game);
    }

    socket.on('disconnect', function() {
        console.log(`user disconnected`);
        game.dropPlayer(socket);
    });

    socket.on('hello', function(playerInfo) {
        console.log(`user says hello`);
        game.updatePlayer(socket, playerInfo);
    });

    socket.on('PM', function(playerInfo) {
        console.log(`user says hello`);
        game.movePlayer(socket, playerInfo);
    });
};

class Game {
    constructor() {
        this.players = {};
        this.slotsAvailable = [3, 2, 1, 0];

        this.intervalId = setInterval(() => this.update(), 200);
    }

    isFull() {
        return this.slotsAvailable.length === 0;
    }

    getSlot() {
        return this.slotsAvailable.pop();
    }

    addPlayer(socket) {
        const playerId = socket.id;
        const playerNumber = this.getSlot();

        socket.emit('currentPlayers', this.players);

        let playerInfo = {
            id: playerId,
            playerNumber: playerNumber,
        };
        this.players[playerNumber] = playerInfo;

        console.log(`Player ${playerId} Joined. Number: ${playerNumber}`);

        socket.emit('welcome', playerInfo);
    }

    updatePlayer(socket, playerInfo) {
        let player = this.players[socket.id];

        if (player) {
            this.players[socket.id] = {
                ...player,
                ...playerInfo,
            }

            console.log("updating Players");
            socket.broadcast.emit('currentPlayers', this.players);
        }
    }

    movePlayer(socket, playerPosition) {
        let player = this.players[socket.id];

        if (player) {
            this.players[socket.id].position = playerPosition;

            socket.broadcast.emit('PM', [socket.id, ...playerPosition]);
        }
    }

    dropPlayer(socket) {
        const playerId = socket.id;

        let player = this.players[playerId];
        if (player) {
            this.slotsAvailable.push(player.playerNumber);
            delete this.players[playerId];

            socket.broadcast.emit('playerLeft', playerId);
        }
    }

    hasPlayer(playerId) {
        return !!this.players[playerId];
    }

    update() {

    }
}
