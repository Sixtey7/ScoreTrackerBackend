import mongodb = require('mongodb');
import Player from '../models/player';

export default class PlayerDao {
    private conn: mongodb.Db;

    private collectionName: string = 'player';

    constructor(_conn: mongodb.Db) {
        this.conn = _conn;
    }

    superTest() {
        console.log('Running super test');
        this.conn.collection('test', function(error, test) {
            if (error) {
                console.error(error);
                console.log(error);
                return;
            }

            //console.log(test);

            console.log('about to try to find the object');
            test.find({}).toArray(function(error, object) {
                if (error) {
                    console.log('GOT AN ERROR');
                    console.error(error);
                    console.log(error);
                    return;
                }

                console.log('got something');
                console.log('Got the object: ' + JSON.stringify(object));
            });

            console.log('about to insert');
            test.insert({"hello": 6}, function(error, newObj) {
                if (error) {
                    console.log('got an error!');
                    console.log(error);
                    console.error(error);
                    return;
                }

                console.log('inserted the object: ' + JSON.stringify(newObj));
        
            });
            console.log('post insert');
        });
    }

    getPlayer(idToFind: string) {
        this.conn.collection(this.collectionName, function(error, playerCollection) {
            if (error) {
                console.error(error);
                return;
            }

            playerCollection.find({_id: idToFind}).batchSize(1).nextObject(function(error, player) {
                if (error) {
                    console.error(error);
                    return;
                }

                console.log('Got the player back: ' + JSON.stringify(player));
            });
        });
    }
}