import { 
    Player,
    IPlayerModel,
    PlayerResult,
    IPlayerResultModel,
    GameResult,
    IGameResultModel,
    GameList,
    ScoringType,
    GameResultSummary,
    IGameDefModel,
    GameDef,
    IGameDefExpansionModel,
    GameDefExpansion,
    PlayerResultSummary
} from '../../shared/shared';

export default class StandardController {

    sayHello(): string {
        return 'hello world';
    }


    public startGame(_gameDef: string | number, _date?: number): Promise<IGameResultModel> {
        return new Promise((resolve, reject) => {
            let gameDate: Date;
            if (_date) {
                gameDate = new Date(_date);
            }
            else {
                gameDate = new Date();
            }
            let gameResult: IGameResultModel = new GameResult({ gameDefId: _gameDef, date: gameDate});
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

    public getAllGames(): Promise<IGameResultModel[]> {
        return new Promise((resolve, reject) => {
            GameResult.find({}, function(err, games) {
                if (err) {
                    console.error('Got an error trying to query all games: ' + err);
                    reject(err);
                }
                else {
                    resolve(games);
                }
                
            });
        });
    }


    public getAllGamesSummary(): Promise<GameResultSummary[]> {
        return new Promise((resolve, reject) => {
            GameResult.find({}, {_id: 1, game: 1, 'playerResults.playerId': 1, 'playerResults.score': 1}, function(err, games) {
                if (err) {
                    console.log('Got an error trying to get a subset of params: ' + err);
                    reject(err);
                }

                if (games) {
                    let returnVal: GameResultSummary[] = new Array<GameResultSummary>();
                    for (let x: number = 0; x < games.length; x++) {
                        let newVal: GameResultSummary = new GameResultSummary(games[x].id, games[x].gameDefId, games[x].date);
                        for (let y: number = 0; y < games[x].playerResults.length; y++) {
                            newVal.playerResults.push(new PlayerResultSummary(games[x].playerResults[y].playerId, games[x].playerResults[y].score));
                        }
                        
                        if (newVal === null) {
                            console.log('NULL');
                        }
                        returnVal.push(newVal);
                    }

                    resolve(returnVal);
                }
                else {
                    reject('No results found!');
                }
            })
        })
    }

    public getAllPlayers(): Promise<IPlayerModel[]> {
        return new Promise((resolve, reject) => {
            Player.find({}, function(err, players) {
                if (err) {
                    console.error('got an error trying to query all players: ' + err);
                    reject(err);
                }
                resolve(players);
            })
        })
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

    public saveGame(gameId: string, playerArray: IPlayerResultModel[]) : Promise<boolean>{
        let that = this;

        return new Promise((resolve, reject) => {
            let query = { _id: gameId };
            GameResult.findOne(query, function(err, game) {
                if (err) {
                    console.error('Got an error trying to find the game with game id: ' + gameId + '\n' + err);
                    reject(err);
                }
                else {
                    if (game) {
                        //need to match up the player results object
                        for (let clientCounter: number = 0; clientCounter < playerArray.length; clientCounter++) {
                            let foundPlayer: boolean = false;
                            let serverResultCounter: number = -1;
                            for (serverResultCounter = 0; serverResultCounter < game.playerResults.length; serverResultCounter++) {
                                if (game.playerResults[serverResultCounter].playerId === playerArray[clientCounter].playerId) {
                                    foundPlayer = true;
                                    break;
                                }
                            }

                            if (foundPlayer) {
                                console.log('copying score');
                                game.playerResults[serverResultCounter].score = playerArray[clientCounter].score;
                            }
                            else {
                                console.log('creating a new player for id: ' + playerArray[clientCounter]._id);
                                let newServerPlayer: IPlayerResultModel = new PlayerResult();
                                newServerPlayer.playerId = playerArray[clientCounter].playerId;
                                newServerPlayer.score = playerArray[clientCounter].score;
                                game.playerResults.push(newServerPlayer);
                            }
                        }

                        game.save()
                            .then(response => {
                                console.log('Successfully saved the game!');
                                resolve(true);
                            },
                            err => {
                                console.error('got an error attempting to save the game:\n' + err);
                                resolve(false);
                            }
                        );
                    }
                    else {
                        console.error('no game found for gameId: ' + gameId);
                        reject('no game found for id: ' + gameId);
                    }
                }
            });
        });
    }

    public addGameDef(_gameName: string, _scoringType: ScoringType): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let newGame: IGameDefModel = new GameDef({name: _gameName, scoringType: _scoringType});

            newGame.save()
                .then(response => {
                    console.log('successfully added the game def');
                    resolve(true)
                }, 
                err => {
                    console.error('got an error attempting to save a new game\n' + err);
                    reject(err);
                });
        });
    }

    public getAllGameDefs(): Promise<IGameDefModel[]> {
        return new Promise((resolve, reject) => {

            GameDef.find({}, function(err, gameDefs) {
                if (err) {
                    console.error('Got an error attempting to get all game defs\n' + err);
                    reject(err);
                }
                else {
                    resolve(gameDefs);
                }
            });
        });
    };

    public addExpansionToGame(_gameDefId: number, _expansionName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let query = { _id: _gameDefId };
            GameDef.findOne(query, function(err, gameDef) {
                if (err) {
                    console.error('Got an error attempting to find GameDef with ID: ' + _gameDefId);
                    reject(err);
                }
                else {
                    if (gameDef) { 
                        //double check that the expansion hasn't already been added
                        let found: boolean = false;
                        for (let x: number = 0; x < gameDef.expansions.length; x++) {
                            if (gameDef.expansions[x].name === _expansionName) {
                                found = true;
                                break;
                            }
                        }

                        if (found) {
                            console.error('Add expansion for game was called to add: ' + _expansionName + ' to game: ' + _gameDefId + ' -- expansion was already added!');
                            reject('expansion already added!');
                        }
                        else {
                            let newExpansion: IGameDefExpansionModel = new GameDefExpansion({name: _expansionName});
                            gameDef.expansions.push(newExpansion);

                            gameDef.save()
                                .then(response => {
                                    console.log('got the response from saving the game def:\n' + response);
                                    resolve(true);
                                },
                                err => {
                                    console.error('got an error from attempting to save the game def:\n' + err);
                                    reject(err);
                                });                            
                        }
                    }
                }
            });
        });
    }
 }