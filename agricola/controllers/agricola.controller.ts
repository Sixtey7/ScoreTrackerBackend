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

            let gameResult: IAgricolaGameResultModel = new AgricolaGameResult({ game: GameList.AGRICOLA, date: gameDate});
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
                        let newVal: GameResultSummary = new GameResultSummary(games[x].id, games[x].game, games[x].date);
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
                        that.addPlayerToGame(_gameId, player) 
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

                    let newPlayerResult: IAgricolaPlayerResultModel = new AgricolaPlayerResult({ playerId: _player.id, score: 0});
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

}