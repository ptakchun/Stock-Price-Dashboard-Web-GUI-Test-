var monk = require('monk');
var express = require('express');
var router = express.Router();

var SERVER_CONFIG = {
                    "symbols": [
                        "AAAA",
                        "BBBB",
                        "CCCC",
                        "DDDD",
                        "EE",
                        "FF",
                        "GG",
                        "HH",
                        "II",
                        "JJ",
                        "KKK",
                        "LLL",
                        "CCCCA",
                        "DDDDA",
                        "EEA",
                        "FFA",
                        "GGA",
                        "HHA",
                        "IIA",
                        "JJA",
                        "AAAAB",
                        "BBBBB",
                        "CCCCB",
                        "DDDDB",
                        "EEBB",
                        "FFB",
                        "GGB",
                        "HHB",
                        "IIB",
                        "JJB",
                        "KKBK",
                        "LLLB",
                        "CCCCAB",
                        "DDDDAB",
                        "EEAB",
                        "FFAB",
                        "GGAB",
                        "HHAB",
                        "IIAB",
                        "JJAB",

                    ],
                    "update_frequency_milliseconds": 3000,
                    "elements_per_update": 50,
                    "available_symbols": [
                        "AAAA",
                        "BBBB",
                        "CCCC",
                        "DDDD",
                        "EE",
                        "FF",
                        "GG",
                        "HH",
                        "II",
                        "JJ",
                        "KKK",
                        "LLL",
                        "CCCCA",
                        "DDDDA",
                        "EEA",
                        "FFA",
                        "GGA",
                        "HHA",
                        "IIA",
                        "JJA",
                        "AAAAB",
                        "BBBBB",
                        "CCCCB",
                        "DDDDB",
                        "EEBB",
                        "FFB",
                        "GGB",
                        "HHB",
                        "IIB",
                        "JJB",
                        "KKBK",
                        "LLLB",
                        "CCCCAB",
                        "DDDDAB",
                        "EEAB",
                        "FFAB",
                        "GGAB",
                        "HHAB",
                        "IIAB",
                        "JJAB",

                    ]
                };

var UPDATE_TABLE = setInterval(()=>{
    
    let today = new Date();
    console.log(today);
    for(let i in SERVER_CONFIG["symbols"]){
        let element = SERVER_CONFIG["symbols"][i];
        let db = monk('localhost:27017/table');
        db.collection(element).insert({"time":today, "price": Math.round(Math.random()*1000)/10 },function(err,results){
            if (err){
                console.log(err);
            }
            db.close();
        });
    }

}, SERVER_CONFIG["update_frequency_milliseconds"]);



router.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.send(200);
});



//API: GET /getTable  GET /getServerConfig  POST /setServerConfig  POST /getHistoricalPriceTable

router.get('/getTable', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true'
    });

    const promises = [];
    let n = SERVER_CONFIG['elements_per_update'] < SERVER_CONFIG["symbols"].length ? SERVER_CONFIG['elements_per_update']:SERVER_CONFIG["symbols"].length;
    n = n<500? n: 500;
    for(let i=0; i<n; ++i){
        let element = SERVER_CONFIG["symbols"][i];
        promises.push((function(element){
            return new Promise((resolve, reject) => {
                let db = monk('localhost:27017/table');
                db.get(element).find({},{limit:1,sort:{'time':-1}}).then(function(result) {
                    db.close();
                    result[0]["symbol"] = element;
                    
                    resolve(result[0]);
                    
                }).catch((e)=>{
                    console.log(e);
                    db.close();
                });
                
        });
        })(element));
    }
    
    Promise.all(promises).then((results)=>{
        res.json(results);
    }).catch((e)=>{
        console.log(e);

    });
 
    

});

router.get('/getServerConfig', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true'
    });
    res.json(SERVER_CONFIG);
});


router.post('/setServerConfig', function(req, res) {
    
    res.set({
        "Access-Control-Allow-Origin": 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true'
    });
    
    let server_config_input = req.body;
    console.log(server_config_input);
    for(let key in server_config_input){
        SERVER_CONFIG[key] = server_config_input[key];
    }

    
    clearInterval(UPDATE_TABLE);
    console.log(SERVER_CONFIG);
    UPDATE_TABLE = setInterval(()=>{
        console.log("run");
        let today = new Date();
        console.log(today);
        for(let i in SERVER_CONFIG["symbols"]){
            let db = monk('localhost:27017/table');
            let element = SERVER_CONFIG["symbols"][i];
            db.collection(element).insert({"time":today, "price": Math.round(Math.random()*1000)/10 },function(err,results){
                if (err){
                    console.log(err);
                }
                db.close();
            });
        }
    }, SERVER_CONFIG["update_frequency_milliseconds"]);

});


router.post('/getHistoricalPriceTable', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true'
    });
    let symbol = req.body.symbol;
    let today = new Date();
    let fiveMinAgo = new Date(today- (1000*60*5));
    let db = monk('localhost:27017/table');
    db.get(symbol).find({"time":{
        $gte: fiveMinAgo,
        
    }},{sort:{'time':-1}}).then(function(result) {
        db.close();
        res.json(result);
        
    }).catch((e)=>{
        console.log(e);
        db.close();
    });
});

module.exports = router;