import { 
    Player,
    IPlayerModel,
    PlayerResult,
    IPlayerResultModel,
    GameResult,
    IGameResultModel,
    GameList
} from '../../shared/shared';

export default class StandardController {

    sayHello(): string {
        return 'hello world';
    }


    public startGame(_gameType: GameList, _date?: number): Promise<IGameResultModel> {
        return new Promise((resolve, reject) => {
            let gameDate: Date;
            if (_date) {
                gameDate = new Date(_date);
            }
            else {
                gameDate = new Date();
            }
            let gameResult: IGameResultModel = new GameResult({ game: _gameType, date: gameDate});
            gameResult.save()
                .then(response => {
                    resolve(gameResult);
                }, err => {
                    reject(err);
                });
        });
    }

    public getPlayers(playerIds: string[]) {
        return new Promise((resolve, reject) => {
            var query = { _id : {$in : playerIds}};

            Player.find(query, function(err, players) {
                if (err) { 
                    console.error('got an error attempting to find the players:\n' + err);
                    reject(err);
                }

                if (players) {
                    resolve(players);
                }
                else {
                    console.error('no players were found for the given ids');
                    reject('No players found!');
                }
            })
        })
    }

    public getAllGames(): Promise<IGameResultModel> {
        return new Promise((resolve, reject) => {
            GameResult.find({}, function(err, games) {
                if (err) {
                    console.error('Got an error trying to query all games: ' + err);
                    reject(err);
                }

                if (games) {
                    resolve(games);
                }
                else {
                    reject('No games found!');
                }
                
            });
        });
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
            //find the game for that given id
            var query = { _id: _gameId };
            GameResult.findOne(query, function(err, game) {
                if (err) {
                    reject('Failed to find a game matching the id provided');
                }

                if (game) {

                    for (let x: number = 0; x < game.playerResults.length; x++) {
                        if (game.playerResults[x].id === player.id) {
                            //the user has already been added to the game!
                            reject('The user has already been added to the game!');
                        }
                    }

                    //if we're here, the user hasn't been added yet - lets add it
                    //first, create a new player result
                    let newPlayerResult : IPlayerResultModel = new PlayerResult( {playerId: player.id, score: 0});
                    game.playerResults.push(newPlayerResult);

                    game.save().
                        then(response => {
                            console.log('successfully save the game!');
                            resolve(true);
                        }, err => {
                            console.log('got an error attempting to save the game after adding the user!');
                            reject('Failed to update game entry');
                        });
                }   
                else {
                    reject ('game not found with that id!');
                }
            });
            
        });
        
    }

    public getScore(_gameId: number): Promise<IGameResultModel> {
        return new Promise((resolve, reject) => {
            var query = {_id: _gameId};
            GameResult.findOne(query, function(err, game) {
                if (err) {
                    reject(err);
                }

                if (game) {
                    resolve(game);
                }
                else {
                    reject('No game found for the given id');
                }
            });
        });
    }

    public setScore(_gameId: number, _playerId: number, _score: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            var query = { _id: _gameId };
            GameResult.findOne(query, function(err, game) {
                if (err) {
                    console.error('Got an error attempting to find a game with id: ' + _gameId);
                    reject(err);
                }
                
                if (game) {
                    //found a game
                    let foundPlayer: boolean = false;
                    for (let x: number = 0; x < game.playerResults.length; x++) {
                        if (game.playerResults[x].playerId === _playerId) {
                            //found a matching player
                            foundPlayer = true;
                            console.log('found a matching player!');
                            game.playerResults[x].score = _score;
                            //now save the game
                            game.save()
                                .then(() => resolve(true), () => resolve(false));
                        }
                        else {
                            console.log(game.playerResults[x].playerId + '\ndoes not equal\n' + _playerId);
                        }

                    }

                    if (!foundPlayer) {
                        reject('player not found for game!');
                    }
                }
                else {
                    console.error('No game was found for id: ' + _gameId);
                    reject('No game found for given id (' + _gameId + ')');
                }
            })
        });
    }
}