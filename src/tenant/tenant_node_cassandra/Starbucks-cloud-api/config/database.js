var Cassandra = require('express-cassandra');

var models = Cassandra.createClient({
    clientOptions: {
        contactPoints: ['127.0.0.1'],
        protocolOptions: { port: 9042 },
        keyspace: 'student',
        queryOptions: {consistency: Cassandra.consistencies.one}
    },
    ormOptions: {
    	udts: {
            orderitem: {
                qty : 'int',
                name: 'text',
                milk: 'text',
                size: 'text'
            }
        },
        defaultReplicationStrategy : {
            class: 'SimpleStrategy',
            replication_factor: 1
        },
        migration: 'safe',
        createKeyspace: true
    }
});

models.connect(function (err) {
    if (err) console.log(err);
    console.log('Cassandra Connection Successful: 9024');
    
    models.loadSchema('Order', {
        fields:{
            id       : {
                 type: 'text'
            },
            location : {
                 type: 'text'
            },
            items: {
                type: 'frozen',
                typeDef: '<orderitem>'
            },
            links    : {
                 type: "map",
              typeDef: "<text, text>"
            },
            status	 : {
                 type: "text"
            },
            message  : {
            	 type: "text"
            }
        },
        key:["id"]
    }, function(err, UserModel){
    	 if(err) throw err;
         console.log("Database Connection and Configuration Successful!");
    });
});

module.exports = models;