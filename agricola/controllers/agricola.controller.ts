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


    public startGame(): GameResult {
        //TODO remove hardcoded id
        let id: number = 12345;

        let gameResult: GameResult = new GameResult(id, GameList.AGRCIOLA);

        return gameResult;

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

    public getScore(_gameId: number, _gameType: GameList): GameResult {
        //TODO: Implement this for real
        let returnResult: GameResult = new GameResult(_gameId, _gameType);

        let playerResultOne: PlayerResult = new PlayerResult(123);
        playerResultOne.setScore(5);
        returnResult.addPlayerToGame(playerResultOne);


        return returnResult;
    }

    public setScore(_gameId: number, _playerId: number, _score: number): boolean {
        let returnResult: boolean = false;

        /*
            Plan is to first find the game result, then set the score for the player
        */

        let fakeGameResult: GameResult = new GameResult(_gameId, GameList.AGRCIOLA);

        fakeGameResult.updateScoreForPlayerId(_playerId, _score);

        //TODO: For now, always returning true to get rid of some errors on the frontend
        returnResult = true;
        //TODO End yet another hacky bs
        return returnResult;
    }
}