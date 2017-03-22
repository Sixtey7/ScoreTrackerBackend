import {
    IPlayerModel,
    GameList,
    GameResultSummary,
    PlayerResultSummary,
    Player,
} from '../../shared/shared';

import {
    AgricolaPlayerResult,
    IAgricolaPlayerResultModel,
    AgricolaGameResult,
    IAgricolaGameResultModel
} from '../agricola';

export default class AgricolaController {
    public test() : Promise<IAgricolaGameResultModel> {
        return new Promise ((resolve, reject) => {
            let agGameResult: IAgricolaGameResultModel = new AgricolaGameResult({ game: GameList.AGRICOLA});

            let playerResult: IAgricolaPlayerResultModel = new AgricolaPlayerResult({ playerId: 1234});
            playerResult.cowNum = 5;
            playerResult.familyNum = 4;

            agGameResult.playerResults.push(playerResult);

            agGameResult.save()
                .then(response => {
                    resolve(agGameResult);
                }, err => {
                    reject (err);
                })
        });
    }

    public startGame(_date?: number): Promise<IAgricolaGameResultModel> {
        return new Promise((resolve, reject) => {
            let gameDate: Date;
            if (_date) {
                gameDate = new Date(_date);
            }
            else {
                gameDate = new Date();
            }

            //TODO: need to determine the game def id of the agricola entry
            let agricolaGameDefId: number = this.findAgricolaGameDefId();
            let gameResult: IAgricolaGameResultModel = new AgricolaGameResult({ gameDefId: agricolaGameDefId, date: gameDate});
            gameResult.save()
                .then(response => {
                    resolve(gameResult);
                }, err => {
                    reject(err);
                }
            );
        })
    }

    public getPlayers(playerIds: string[]) : Promise<IPlayerModel> {
        return new Promise((resolve, reject) => {
            let query = { _id: {$in: playerIds}};

            Player.find(query, function(err, players) {
                if (err) {
                    console.error('Got an error trying to find a list of players: ' + err);
                    reject(err);
                }
                else {
                    resolve(players);
                }
            });
        });
    };

    public getAllGames(): Promise<IAgricolaGameResultModel> {
        return new Promise((resolve, reject) => {
            AgricolaGameResult.find({}, function(err, games) {
                if (err) {
                    console.error('Got an error attempting to get all agricola games!');
                    reject(err);
                }
                else {
                    resolve(games);
                }
            });
        });
    }

    public getAllGamesSummary(): Promise<GameResultSummary[]> {
        return new Promise((resolve, reject) =>  {
            AgricolaGameResult.find({}, {_id: 1, game: 1, date: 1, 'playerResults.playerId': 1, 'playerResults.score': 1}, function(err, games) {
                if (err) {
                    console.log('Got an error trying to get a subset of params: ' + err);
                    reject(err);
                }

                if (games) {
                    let returnVal: GameResultSummary[] = new Array<GameResultSummary>();
                    for (let x: number = 0; x < games.length; x++) {
                        //TODO: Need to determine the id for agricola game
                        let newVal: GameResultSummary = new GameResultSummary(games[x].id, 12345, games[x].date);
                        for (let y = 0; y < games[x].playerResults.length; y++) {
                            newVal.playerResults.push(new PlayerResultSummary(games[x].playerResults[y].playerId, games[x].playerResults[y].score));
                        }

                        returnVal.push(newVal);
                    }

                    resolve(returnVal);
                }
                else {
                    reject('No results found');
                }
            })
        })    
    }

    public getAllPlayers(): Promise<IPlayerModel[]> {
        return new Promise((resolve, reject) => {
            Player.find({}, function(err, players) {
                if (err) {
                    reject(err);
                }
                else { 
                    resolve(players);
                }
            });
        });
    };

    public addPlayer(_gameId: number, _name: string): Promise<IAgricolaPlayerResultModel> {
        let that = this;
        return new Promise((resolve, reject) => {
            //first, look to see if the user already exists
            var query = { name: _name};
            Player.findOne(query, function(err, player) {
                if (err) {
                    console.error('got an error looking for the player');
                    reject(err)
                };

                if (player) {
                    console.log('player already exists, not creating an ew one');
                    //now that we found the player - we need to add it to the game
                    that.addPlayerToGame(_gameId, player)
                        .then(success => {
                            resolve(success);
                        })
                        .catch(err => {
                            console.error('failed to add player to agricola game ' + err);
                            reject(err);
                        });
                }
                else {
                    console.log('player does not exist, creating a new one!');
                    let newPlayer = new Player({'name': _name});

                    newPlayer.save().then(response => {
                        console.log('Success!: ' + JSON.stringify(response));
                        console.log('The assigned id was: ' + newPlayer.id);

                        //now that we've created the player - add it to the game
                        that.addPlayerToGame(_gameId, newPlayer) 
                            .then(success => {
                                resolve(success);
                            })
                            .catch(err => {
                                console.error('failed to add new player to agricola game ' + err);
                                reject(err);
                            });
                    })
                }
            });
        });
    }

    private addPlayerToGame(_gameId, _player: IPlayerModel): Promise<IAgricolaPlayerResultModel> {
        return new Promise((resolve, reject) => {
            let query = { _id: _gameId};
            AgricolaGameResult.findOne(query, function(err, game) {
                if (err) {
                    console.error('failed to find the game with id: ' + _gameId + '\n' + err);
                    reject(err);
                }

                if (game) {
                    for (let x: number =0; x < game.playerResults.length; x++) {
                        if (game.playerResults[x].playerId === _player.id) {
                            reject('the use has already been added to the game!');
                        }
                    }

                    console.log('adding a new player with the id: ' + _player._id);

                    let newPlayerResult: IAgricolaPlayerResultModel = new AgricolaPlayerResult({ playerId: _player._id, score: 0});

                    console.log('created the agricola player result: ' + JSON.stringify(newPlayerResult));
                    game.playerResults.push(newPlayerResult);

                    game.save()
                        .then(response => {
                            console.log('successfully added the player to the game!');
                            resolve(newPlayerResult);
                        }, err => {
                            console.log('got an error attempting to save a game after adding the user!');
                            reject('failed to update game entry!');
                        })
                }
                else {
                    console.error('could not find game entry for id: ' + _gameId);
                    reject('could not find game with id: ' + _gameId);
                }
            });
        });
    }

    public getScore(_gameId: number): Promise<IAgricolaGameResultModel> {
        return new Promise((resolve, reject) => {
            let query = { _id: _gameId};
            AgricolaGameResult.findOne(query, function(err, game) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(game);
                }
            });
        });
    }

    public setScore(_gameId: number, _player: IAgricolaPlayerResultModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let query = {_id: _gameId};
            if (_player) {
                AgricolaGameResult.findOne(query, function(err, game) {
                    if (err) {
                        reject(err);
                    }
                    else if (game) {
                        for (let x: number = 0; x < game.playerResults.length; x++) {
                            let foundPlayer: boolean = false;
                            if (game.playerResults[x].playerId === _player.playerId) {
                                console.log('found a matching player!');
                                foundPlayer = true;
                                game.playerResults[x] = _player;
                            }

                            if (!foundPlayer) {
                                console.log('creating new player for\n' + JSON.stringify(_player));
                                console.log('did not find a player in the game: ' + _player.id);
                                game.playerResults.push(_player);
                            }

                            game.save()
                                .then(response => {
                                    console.log('successfully saved the game!');
                                    resolve(true);
                                }, err => {
                                    console.log('Got an error trying to save the game!\n' + err);
                                    resolve(false);
                                });
                        }
                    }
                    else {
                        console.error('no game found for id: ' + _gameId);
                        reject('No game found for id!');
                    }
                });
            }
            else {
                console.error('NULL Player Received in setScore!');
                reject('null player');
            }
        });
    };

    public saveGame(gameId: string, playerArray: IAgricolaPlayerResultModel[]) : Promise<boolean>{
        let that = this;
        return new Promise((resolve, reject) => {
            let query = { _id: gameId };
            AgricolaGameResult.findOne(query, function(err, game) {
                if (err) {
                    console.error('Got an error attempting to find game with id: ' + gameId + '\n' + err);
                    reject(err);
                }
                else {
                    if (game) {
                        // need to match up the player results objects
                        for (let clientCounter: number = 0; clientCounter < playerArray.length; clientCounter++) {
                            //try to find the player in the results collection (to get the id)
                            let foundPlayer: boolean = false;
                            let serverResultCounter: number = -1;
                            for (serverResultCounter = 0; serverResultCounter < game.playerResults.length; serverResultCounter++) {
                                if (game.playerResults[serverResultCounter].playerId === playerArray[clientCounter].playerId) {
                                    foundPlayer = true;
                                    break;
                                }
                            }

                            if (foundPlayer) {
                                //copy over all of the results
                                console.log('copying results!');
                                //set the ids based on the server object
                                playerArray[clientCounter]._id = game.playerResults[serverResultCounter]._id;
                                playerArray[clientCounter].id = game.playerResults[serverResultCounter].id;
                                game.playerResults[serverResultCounter] = playerArray[clientCounter];
                            } else {
                                console.log('creating a new player for id: ' + playerArray[clientCounter].id);
                                let newServerPlayer: IAgricolaPlayerResultModel = new AgricolaPlayerResult();
                                game.playerResults.push(that.copyClientPlayerToServerResult(playerArray[clientCounter], newServerPlayer));
                            }
                        }
                        
                        game.save()
                            .then(response => {
                                    console.log('successfully saved the game!');
                                    resolve(true);
                                }, err => {
                                    console.log('Got an error trying to save the game!\n' + err);
                                    resolve(false);
                                }
                            );

                    }
                    else {
                        console.error('No game found for gameId: ' + gameId);
                        reject('Nogame found for id: ' + gameId);
                    }
                }
            });
        });
    }

    private findAgricolaGameDefId(): number {
        //TODO: Implement
        return 12345;
    }

    private copyClientPlayerToServerResult(clientPlayer: IAgricolaPlayerResultModel, serverPlayer: IAgricolaPlayerResultModel): IAgricolaPlayerResultModel {
        serverPlayer.bonusNum = clientPlayer.bonusNum;
        serverPlayer.cardNum = clientPlayer.cardNum;
        serverPlayer.clayNum = clientPlayer.clayNum;
        serverPlayer.cowNum = clientPlayer.cowNum;
        serverPlayer.familyNum = clientPlayer.familyNum;
        serverPlayer.fieldsNum = clientPlayer.fieldsNum;
        serverPlayer.grainNum = clientPlayer.grainNum;
        serverPlayer.pastureNum = clientPlayer.pastureNum;
        serverPlayer.pigNum = clientPlayer.pigNum;
        serverPlayer.sheepNum = clientPlayer.sheepNum;
        serverPlayer.stableNum = clientPlayer.stableNum;
        serverPlayer.stoneNum = clientPlayer.stoneNum;
        serverPlayer.vegNum = clientPlayer.vegNum;
        serverPlayer.score = clientPlayer.score;
    
        return serverPlayer;
    }

}