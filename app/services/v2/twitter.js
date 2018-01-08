var Twit = require('twit');
var axios = require('axios');
const CronJob = require('cron').CronJob;
const async = require('async');
var request = require('request');
var uji = require('../../model/datatest');
const words = require('../../model/datatests-preprocesseds');

console.log('twitter stream');


var T = new Twit({
	consumer_key: 'rn6vG9oH3PqQTtXOFibPEhRGT',
	consumer_secret: 'lDAcGsiwye3sbjRzEp3eXtHvAEsomx6LF27xuhUpoAFk7lCkrk',
	access_token: '1261496917-1j5yJrv1vnBqCy72eAbPcBxKba03r0ke9NqisAa',
	access_token_secret: 'OhMP4xSHq0txOtaioVfPk2ylbZXIciP99CE8YxQbpNiyc',
	timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests. 
});

module.exports.test = (req, res, next)=>{
	T.get('search/tweets', { q: 'veranda', count: 100 }, function(err, data, response) {
		res.json(data);
	})
}
/*
	Cron UNIKOM TWEET
*/
const cronTag2 = new CronJob({
  cronTime: '0 * * * * *',
  onTick() {
    console.log("check keywords unikom twitter")        
              async.waterfall([
                            function (callback) {
                                 T.get('search/tweets', { q: 'unikom', count: 100 }, function(err, data, response) {
                                  // console.log(res);
                                    (data.statuses).forEach((comment)=>{
                                      async.waterfall([
                                        function(callback){
                                            var check = uji.find({ text: comment.text, source : 'Twitter' }, (err, doc) => {
                                               if (doc.length > 0) {
                                                  console.log("Already exist");
                                                } else {
                                                    var category = '';
                                                                axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
                                                                    text: comment.text
                                                                }).then(function (response) {
                                                                       
                                                                        // console.log(response.data)
                                                                        var hasil = (response.data).result;
                                                                        if (hasil.length > 1) {
                                                                            if (hasil[0][1] > hasil[1][1]) {
                                                                                category = hasil[0][0]
                                                                            } else {
                                                                                category = hasil[1][0];
                                                                            }
                                                                        } else {
                                                                            category = hasil[0][0];
                                                                        }
                                                                        console.log(response.data.words);
                                                                        var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                        saveWord.save();
                                                                        callback(null, category);
                                                                    })
                                                                    .catch(function (error) {
                                                                        console.log(error.response);
                                                                    });

                                                }
                                         }); 

                                        }
                                      ],function(err, result){
                                                        if(result !== null){
                                                            var tanggal = today();
                                                            const data = {
                                                                    source: 'Twitter',
                                                                    text: comment.text,
                                                                    foto: 'none.jpg',
                                                                    category: result,
                                                                    date : tanggal
                                                                }

                                                                var Train = new uji(data);
                                                                Train.save((err) => {
                                                                    if (err)
                                                                        console.log(err);

                                                                    console.log("saved twitter");
                                                                })
                                                        }else{
                                                            console.log("error");
                                                        }
                                                        
                                      });
                                              
                                    });
                                });

                            }
                ], function (err, result) {
                                
                }); //end waterfall
              // console.log(val.id)
       
  },

  start: true,
  timeZone: 'Asia/Jakarta',
})
/*
	Stream Keyword UNIKOM
*/
var tanggal = today();

var stream = T.stream('statuses/filter', { track: 'unikom' })

stream.on('tweet', function (tweet) {
	console.log(tweet.text);
	async.waterfall([
		function (callback) {
			
			const texts =  JSON.stringify({
                             "Inputs": {
                              "input1": [
                                         {
                                             "Tweet" : tweet.text,
                                             "Label" : ""
                                         }
                                       ]
                               },
                                "GlobalParameters": {}

                               });
							// var categorys = request({
       //                       url: 'https://asiasoutheast.services.azureml.net/subscriptions/7a38336d77ae429085b6d8af7c3b5eeb/services/659fde210c144dadba90d67bc22cb27a/execute?api-version=2.0&format=swagger', //URL to hit
       //                       method: 'POST',
       //                        headers: {
       //                              'Content-Type': 'application/json',
       //                               'Authorization':'Bearer genpswgJfhwA1jw45nF92Abi6N/grBgdWUDG6sBJwAFKpN3XgjLqnBAjD8QJyC6oBZXWfwyZDW+8gijB2/jy4w=='
       //                          },
       //                           body:texts
       //                          }, function(error, response, body){
       //                               if(error) {
       //                                   console.log(error);
       //                                }
       //                                  //console.log(body);
       //                                let bodies = JSON.parse(body);
       //                                console.log(bodies);
       //                                let cats = bodies.Results.output1;
       //                                var category_tweet = '';
       //                                 cats.forEach(function(category){
       //                                   //console.log(category['Scored Labels'] );
       //                                 if(category['Scored Labels'] === 'Negatif'){
       //                                      category_tweet = "Negatif"
       //                                   }else if(category['Scored Labels'] === 'Positif'){
       //                                       category_tweet = "Positif"
       //                                   }
       //                                     // var saveWord = new words({text : response.data.words, date : today(), category : category });
       //                                        //         saveWord.save();
       //                                       callback(null, category_tweet);
       //                              });
       //                          });
								axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
									text: tweet.text
								})
									.then(function (response) {
										if(response.data.status_code === 400){
											callback(null, null);
										}
										var hasil = (response.data).result;
										if (hasil.length > 1) {
											if (hasil[0][1] > hasil[1][1]) {
												category = hasil[0][0]
											} else {
												category = hasil[1][0];
											}
										} else {
											category = hasil[0][0];
										}
										var saveWord = new words({text : response.data.words, date : today(), category : category });
					                    saveWord.save();
									})
									.catch(function (error) {
										console.log(error);
									});

								// callback(null, category);
		}
	], function (err, result) {
		var check = uji.find({ text: tweet.text }, (err, doc) => {

			if (doc.length > 0) {
				console.log("Already exist");
			} else {
				const data = {
					source: 'Twitter',
					text: tweet.text,
					foto_sender: tweet.user.profile_image_url,
					category: result,
					date : tanggal
				}

				var Train = new uji(data);
				Train.save((err) => {
					if (err)
						console.log(err);

					console.log("saved twitter");
				}); //end save
			}		//endif								
		}); //end check
	}); //end waterfall
}); //end stream


/*
	Stream Unikom hits
 */
var stream2 = T.stream('statuses/filter', { track: '#unikomhits' })

stream2.on('tweet', function (tweet) {
	console.log(tweet.text);
	async.waterfall([
		function (callback) {
			var category = '';
			const texts =  JSON.stringify({
                             "Inputs": {
                              "input1": [
                                         {
                                             "Tweet" : tweet.text,
                                             "Label" : ""
                                         }
                                       ]
                               },
                                "GlobalParameters": {}

                               });
			// var categorys = request({
   //                           url: 'https://asiasoutheast.services.azureml.net/subscriptions/7a38336d77ae429085b6d8af7c3b5eeb/services/659fde210c144dadba90d67bc22cb27a/execute?api-version=2.0&format=swagger', //URL to hit
   //                           method: 'POST',
   //                            headers: {
   //                                  'Content-Type': 'application/json',
   //                                   'Authorization':'Bearer genpswgJfhwA1jw45nF92Abi6N/grBgdWUDG6sBJwAFKpN3XgjLqnBAjD8QJyC6oBZXWfwyZDW+8gijB2/jy4w=='
   //                              },
   //                               body:texts
   //                              }, function(error, response, body){
   //                                   if(error) {
   //                                       console.log(error);
   //                                    }
   //                                      //console.log(body);
   //                                    let bodies = JSON.parse(body);
   //                                    console.log(bodies);
   //                                    var category_tweet = '';
   //                                     cats.forEach(function(category){
   //                                       //console.log(category['Scored Labels'] );
   //                                     if(category['Scored Labels'] === 'Negatif'){
   //                                          category_tweet = "Negatif"
   //                                       }else if(category['Scored Labels'] === 'Positif'){
   //                                           category_tweet = "Positif"
   //                                       }
   //                                         // var saveWord = new words({text : response.data.words, date : today(), category : category });
   //                                            //         saveWord.save();
   //                                           callback(null, category_tweet);
   //                                  });
   //                              });
			axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
				text: tweet.text
			})
				.then(function (response) {
					if(response.data.status_code === 400){
						callback(null, null);
					}
					var hasil = (response.data).result;
					if (hasil.length > 1) {
						if (hasil[0][1] > hasil[1][1]) {
							category = hasil[0][0]
						} else {
							category = hasil[1][0];
						}
					} else {
						category = 'Negatif';
					}
					var saveWord = new words({text : response.data.words, date : today(), category : category });
                    saveWord.save();
				})
				.catch(function (error) {
					console.log(error);
				});

			callback(null, category);
		}
	], function (err, result) {
		var check = uji.find({ text: tweet.text }, (err, doc) => {

			if (doc.length > 0) {
				console.log("Already exist");
			} else {
				const data = {
					source: 'Twitter',
					text: tweet.text,
					foto_sender: tweet.user.profile_image_url,
					category: result,
					date : tanggal
				}

				var Train = new uji(data);
				Train.save((err) => {
					if (err)
						console.log(err);

					console.log("saved twitter");
				}); //end save
			}		//endif								
		}); //end check
	}); //end waterfall
}); //end stream

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