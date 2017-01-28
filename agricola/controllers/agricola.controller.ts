import { 
    Player,
    IPlayerModel,
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

    public addPlayer(_gameId: number, _name: string): Promise<IPlayerModel> {
        let that = this;
        return new Promise((resolve, reject) => {
            console.log('Adding a new player with name: ' + _name);

            //first, look to see if the user already exists
            var query = { name: _name};
            Player.findOne(query, function(err, player) {
                if (err) {
                    console.error('got an error looking for the player');
                    reject(err);
                };

                if (player) {
                    console.log('player already exists, not creating new one');
                    //now that we found the player - we need to add it to the game
                    that.addPlayerToGame(_gameId, player)
                        .then((success) => {
                            if (success) {
                                resolve(player);
                            }
                            else {
                                reject('player could not be added to game!');
                            }
                        })
                        .catch((err) => {
                            reject('failed to add player to game');
                        });
                }
                else {
                    console.log('player did not exist, creating a new one!');
                    let newPlayer = new Player({'name' : _name});

                    newPlayer.save().then( response => {
                        console.log('Success!: ' + JSON.stringify(response));
                        console.log('The assigned id was: ' + newPlayer.id);

                        //now that we created the player, we need to add it to the game
                        that.addPlayerToGame(_gameId, newPlayer)
                            .then((success) => {
                                if (success) {
                                    resolve(newPlayer);
                                }
                                else {
                                    reject('player could not be added to game!');
                                }
                            })
                            .catch((err) => {
                                reject('failed to add player to game');
                            });
                    }, err => {
                        console.log('ERROR: ' + JSON.stringify(err));
                        reject(err);
                    });
                }
            });
        })
    }

    private addPlayerToGame(_gameId: number, player: IPlayerModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
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