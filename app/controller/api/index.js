const async = require('async');
const datatest = require('../../model/datatest');

function Index(){
    this.getSentiment = (req, res, next)=>{
        async.parallel({
            positif : (callback)=>{
                var cutoff = today();
                
                datatest.find({"comment.category": 'Positif'}).count((err, doc)=>{
                    callback(null, doc)
                });
            },
            negatif : (callback)=>{
                var cutoff = today();
                
                datatest.find({"comment.category": 'Negatif'}).count((err, doc)=>{
                    callback(null, doc)
                });
            }
        },(err,result)=>{
            res.json(result);
        });
    }
    this.getComment = (req, res, next)=>{
        // datatest
        // .find({})
        // .sort({createdAt: 'desc'})
        // .limit(3)
        // .exec(function(err, posts) {
        //    res.json(posts);
        // });
        datatest.aggregate([
               {$group:
                 {
                    _id:{ date : '$date'}, 

                     count: {$sum: 1}
                  }
                }
        ]).exec((err, doc)=>{
            if(err)
                console.log(err)

            res.json(doc)
        })
    }
    this.post = (req, res, next)=>{
        datatest.aggregate()
    }
}
function calcTime() {

    var d = new Date();

    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    var nd = new Date(utc + (3600000*7));

    // return time as a string
    return nd.toLocaleString();

}
function today(){
    var indonesia = calcTime();
    var dates = new Date(indonesia);
    var bulan = dates.getMonth()+1;
    var haris = dates.getDate();
    if(bulan < 10){
      bulan = '0'+bulan;
    }
    if(haris < 10){
      haris = '0'+haris;
    }
    var now = haris+'-'+bulan+'-'+dates.getFullYear();
    return now;
}
module.exports = new Index();