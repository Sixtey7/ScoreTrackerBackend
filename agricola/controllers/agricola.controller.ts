import { 
    Player,
    PlayerResult,
    GameResult,
    GameList
} from '../../shared/shared';

export default class AgricolaController {
    sayHello(): string {
        return 'hello world';
    }

    public addPlayer(_gameId: number, _name: string): Player {
        /*
            Plan is to first look to see if we already have a player with the given name - if so, pull that player
            If not, create the player
            return the player record
        */
        
        //TODO: remove hardcoded id
        let id: number = 12345;

        return new Player(id, _name);
    }

    public startGame(): GameResult {
        //TODO remove hardcoded id
        let id: number = 12345;

        let gameResult: GameResult = new GameResult(id, GameList.AGRCIOLA);

        return gameResult;

    }
}