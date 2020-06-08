import {Socket} from "socket.io";

enum PlayerStatus {
    Alive,
    Cursed,
    Dead,
}

enum GameState {
    InLobby,
    Ready,
    Playing,
    Done
}

export class Room {
    id: string;
    state: GameState;
    clients: Map<string, Client>;
    intervalId: NodeJS.Timeout;

    constructor(id: string) {
        this.id = id;
        this.state = GameState.InLobby;
        this.clients = new Map<string, Client>();

        this.intervalId = setInterval(() => this.update(), 200);
    }

    update(): void {

    }

    addClient(client: Client) {
        this.clients.set(client.id, client);
    }

    removeClient(clientId: string) {
        this.clients.delete(clientId);
    }
}

interface PlayerInfoInput {
    id: string;

    x: number;
    y: number;

    speed: number;
    bombs: number;
    power: number;

    status: PlayerStatus;
}

export class Player {
    id: string;

    x: number;
    y: number;

    speed: number;
    bombs: number;
    power: number;

    status: PlayerStatus;

    constructor({id, x, y, power, speed, bombs, status}: PlayerInfoInput) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.power = power;
        this.speed = speed;
        this.bombs = bombs;
        this.status = status;
    }
}

export class Client {
    id: string;
    socket: Socket;
    players: Map<string, Player>;

    constructor(socket: Socket) {
        this.id = socket.id;
        this.socket = socket;
        this.players = new Map<string, Player>();
    }
}
