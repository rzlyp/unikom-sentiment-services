const fb = require('fb');
const cron = require('cron').CronJob;
const async = require('async');

fb.setAccessToken('1935709619975639|fKTU1R1DAHAALrnsDzc7r37n57U');
function FB() {
    this.getFbPage = (req, res, next) => {
        fb.api(
            "/165292613289/posts",
            function (response) {
                if (response && !response.error) {
                    res.json(response);
                } else {
                    console.log(response.error);
                }
            }
        );
    }

    this.getComment = (req, res, next) => {
        fb.api("/165292613289?fields=posts.as(like){reactions.type(LIKE).limit(0).summary(true)}, posts.as(love){reactions.type(LOVE).limit(0).summary(true)}, posts.as(wow){reactions.type(WOW).limit(0).summary(true)},   posts.as(haha){reactions.type(HAHA).limit(0).summary(true)},   posts.as(sad){reactions.type(SAD).limit(0).summary(true)},   posts.as(angry){reactions.type(ANGRY).limit(0).summary(true)},   posts.as(thankful){reactions.type(THANKFUL).limit(0).summary(true)}", (response)=> {
            
                if (response && !response.error) {
                    // console.log(response);
                    // res.json(response.like);
                  async.parallel({
                      like : function(callback){
                        var data = response.like.data;
                        var i = 0;
                        data.forEach((val)=>{
                            if(val.reactions.summary.total_count !== 0){
                                i++;
                            }
                        });
                        callback(null, i);
                      },
                      wow : function(callback){
                        var data = response.wow.data;
                        var i = 0;
                        data.forEach((val)=>{
                            if(val.reactions.summary.total_count !== 0){
                                i++;
                            }
                        });
                        callback(null, ica)
                      }
                    }
                  , function(err, result){
                        res.json(result)
                  });
       } //fb get post if
    });
}
}

module.exports = new FB();