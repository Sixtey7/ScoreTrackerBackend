import mongodb = require('mongodb');

export default class DB {
    private connection : mongodb.Db;

    constructor() {
        var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true});
        this.connection = new mongodb.Db('candy', server, { w: 1 });
        this.connection.open(function() {});

        this.superTest();
    }

    public conn(): mongodb.Db {
        return this.connection;
    }

    superTest() {
        console.log('Running super test');
        this.connection.collection('test', function(error, test) {
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
     
}