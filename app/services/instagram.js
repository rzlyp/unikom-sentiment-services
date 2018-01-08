const CronJob = require('cron').CronJob;
var Instagram = require('instagram-api');
const axios = require('axios');
const async = require('async');
const request = require('request');

const iTag = require('instagram-scraping');
const uji = require('../model/datatest');
const words = require('../model/datatests-preprocesseds');
const ig = new Instagram('1139545080.04d35fb.6d32967626e040cabc8697ac27fc743c');
/*
  Search keywords unikom
*/

const cronIF = new CronJob({
  cronTime: '0 */50 * * * *',
  onTick() {
    console.log("check fanspage ig..")
      ig.userMedia('3264845067').then((result)=>{
          (result.data).forEach((val)=>{
             
              async.waterfall([
                            function (callback) {
                                 ig.mediaComments(val.id).then((res)=>{
                                    (res.data).forEach((comment)=>{
                                      async.waterfall([
                                        function(callback){
                                            var check = uji.find({ text: comment.text }, (err, doc) => {
                                               if (doc.length > 0) {
                                                  console.log("Already exist");
                                                  callback(null, null);
                                                } else {
                                                    var category = '';
                                                    const texts =  JSON.stringify({

                                                               "Inputs": {
                                                                  "input1": [
                                                                    {
                                                                      "Tweet" : comment.text,
                                                                      "Label" : ""
                                                                    }
                                                                  ]
                                                                },
                                                              "GlobalParameters": {}

                                                      });
                                                       var categorys = request({
                                                            url: 'https://asiasoutheast.services.azureml.net/subscriptions/7a38336d77ae429085b6d8af7c3b5eeb/services/659fde210c144dadba90d67bc22cb27a/execute?api-version=2.0&format=swagger', //URL to hit
                                                            method: 'POST',
                                                             headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization':'Bearer genpswgJfhwA1jw45nF92Abi6N/grBgdWUDG6sBJwAFKpN3XgjLqnBAjD8QJyC6oBZXWfwyZDW+8gijB2/jy4w=='
                                                             },
                                                            body:texts
                                                             }, function(error, response, body){
                                                            if(error) {
                                                               console.log(error);
                                                            }
                                                            //console.log(body);
                                                            let bodies = JSON.parse(body);
                                                            console.log(bodies);
                                                            let cats = bodies.Results.output1;
                                                             cats.forEach(function(category){
                                                                //console.log(category['Scored Labels'] );
                                                                if(category['Scored Labels'] === 'Negatif'){
                                                                    category = "Negatif"
                                                                }else if(category['Scored Labels'] === 'Positif'){
                                                                    category = "Positif"
                                                                }
                                                                // var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                //         saveWord.save();
                                                                        callback(null, category);
                                                             });
                                                          });
                                                                // axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
                                                                //     text: comment.text
                                                                // }).then(function (response) {
                                                                //         if(response.data.status_code === 400){
                                                                //             axios.get('https://unikom-sentiment-analysis.herokuapp.com/api/v1/train').then().catch();
                                                                //             callback(null, null);
                                                                //         }
                                                                //         // console.log(response.data)
                                                                //         var hasil = (response.data).result;
                                                                //         if (hasil.length > 1) {
                                                                //             if (hasil[0][1] > hasil[1][1]) {
                                                                //                 category = hasil[0][0]
                                                                //             } else {
                                                                //                 category = hasil[1][0];
                                                                //             }
                                                                //         } else {
                                                                //             category = hasil[0][0];
                                                                //         }
                                                                //         var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                //         saveWord.save();
                                                                //         callback(null, category);
                                                                //     })
                                                                //     .catch(function (error) {
                                                                //         console.log(error.response);
                                                                //     });

                                                }
                                         }); 
                                        }
                                      ],function(err, result){
                                                        if(result !== null){
                                                            var tanggal = today();
                                                            const data = {
                                                                    source: 'Instagram',
                                                                    text: comment.text,
                                                                    foto: comment.from.profile_picture,
                                                                    category: result,
                                                                    date : tanggal
                                                                }

                                                                var Train = new uji(data);
                                                                Train.save((err) => {
                                                                    if (err)
                                                                        console.log(err);

                                                                    console.log("saved instagram");
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
              console.log(val.id)
          });
      },(err)=>{
        console.log(err);
      });
  },

  start: true,
  timeZone: 'Asia/Jakarta',
});

const cronTag = new CronJob({
  cronTime: '0 * * * * *',
  onTick() {
    console.log("check fanspage ig tag unikom..")        
              async.waterfall([
                            function (callback) {
                                 iTag.scrapeTag('unikom').then(function(res){
                                  // console.log(res);
                                    (res.medias).forEach((comment)=>{
                                      async.waterfall([
                                        function(callback){
                                            var check = uji.find({ text: comment.text }, (err, doc) => {
                                               if (doc.length > 0) {
                                                  console.log("Already exist");
                                                } else {
                                                    var category = '';
                                                       const texts =  JSON.stringify({

                                                               "Inputs": {
                                                                  "input1": [
                                                                    {
                                                                      "Tweet" : comment.text,
                                                                      "Label" : ""
                                                                    }
                                                                  ]
                                                                },
                                                              "GlobalParameters": {}

                                                      });
                                                       var categorys = request({
                                                            url: 'https://asiasoutheast.services.azureml.net/subscriptions/7a38336d77ae429085b6d8af7c3b5eeb/services/659fde210c144dadba90d67bc22cb27a/execute?api-version=2.0&format=swagger', //URL to hit
                                                            method: 'POST',
                                                             headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization':'Bearer genpswgJfhwA1jw45nF92Abi6N/grBgdWUDG6sBJwAFKpN3XgjLqnBAjD8QJyC6oBZXWfwyZDW+8gijB2/jy4w=='
                                                             },
                                                            body:texts
                                                             }, function(error, response, body){
                                                            if(error) {
                                                               console.log(error);
                                                            }
                                                            //console.log(body);
                                                            let bodies = JSON.parse(body);
                                                            console.log(bodies);
                                                            let cats = bodies.Results.output1;
                                                             cats.forEach(function(category){
                                                                //console.log(category['Scored Labels'] );
                                                                if(category['Scored Labels'] === 'Negatif'){
                                                                    category = "Negatif"
                                                                }else if(category['Scored Labels'] === 'Positif'){
                                                                    category = "Positif"
                                                                }
                                                                // var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                //         saveWord.save();
                                                                        callback(null, category);
                                                             });
                                                          });
                                                          //       axios.post('https://asiasoutheast.services.azureml.net/subscriptions/7a38336d77ae429085b6d8af7c3b5eeb/services/659fde210c144dadba90d67bc22cb27a/execute?api-version=2.0&format=swagger', texts, headers).then(function (response) {
                                                          //               if(response.data.status_code === 400){
                                                          //                   axios.get('https://unikom-sentiment-analysis.herokuapp.com/api/v1/train').then().catch();
                                                          //                   callback(null, null);
                                                          //               }
                                                          //               // console.log(response.data)
                                                          //               var hasil = (response.data).result;
                                                          //               if (hasil.length > 1) {
                                                          //                   if (hasil[0][1] > hasil[1][1]) {
                                                          //                       category = hasil[0][0]
                                                          //                   } else {
                                                          //                       category = hasil[1][0];
                                                          //                   }
                                                          //               } else {
                                                          //                   category = hasil[0][0];
                                                          //               }
                                                          //               var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                          //               saveWord.save();
                                                          //               callback(null, category);
                                                          //           })
                                                          //           .catch(function (error) {
                                                          //               console.log(error.response);
                                                          //           });

                                                }
                                         }); 

                                        }
                                      ],function(err, result){
                                                        if(result !== null){
                                                            var tanggal = today();
                                                            const data = {
                                                                    source: 'Instagram',
                                                                    text: comment.text,
                                                                    foto: comment.thumbnail,
                                                                    category: result,
                                                                    date : tanggal
                                                            }

                                                                var Train = new uji(data);
                                                                Train.save((err) => {
                                                                    if (err)
                                                                        console.log(err);

                                                                    console.log("saved instagram");
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
               console.log('done ');
       
  },

  start: true,
  timeZone: 'Asia/Jakarta',
});

// const cronTag2 = new CronJob({
//   cronTime: '0 */59 * * * *',
//   onTick() {
//     console.log("check fanspage ig tag #unikombandung..")        
//               async.waterfall([
//                             function (callback) {
//                                  iTag.scrapeTag('unikombandung').then(function(res){
//                                   // console.log(res);
//                                     (res.media).forEach((comment)=>{
//                                       async.waterfall([
//                                         function(callback){
//                                             var check = uji.find({ text: comment.caption }, (err, doc) => {
//                                                if (doc.length > 0) {
//                                                   console.log("Already exist");
//                                                 } else {
//                                                     var category = '';
//                                                                 axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
//                                                                     text: comment.caption
//                                                                 }).then(function (response) {
//                                                                         if(response.data.status_code === 400){
//                                                                             axios.get('https://unikom-sentiment-analysis.herokuapp.com/api/v1/train').then().catch();
//                                                                             callback(null, null);
//                                                                         }
//                                                                         // console.log(response.data)
//                                                                         var hasil = (response.data).result;
//                                                                         if (hasil.length > 1) {
//                                                                             if (hasil[0][1] > hasil[1][1]) {
//                                                                                 category = hasil[0][0]
//                                                                             } else {
//                                                                                 category = hasil[1][0];
//                                                                             }
//                                                                         } else {
//                                                                             category = hasil[0][0];
//                                                                         }
//                                                                         console.log(response.data.words);
//                                                                         var saveWord = new words({text : response.data.words, date : today(), category : category });
//                                                                         saveWord.save();
//                                                                         callback(null, category);
//                                                                     })
//                                                                     .catch(function (error) {
//                                                                         console.log(error.response);
//                                                                     });

//                                                 }
//                                          }); 

//                                         }
//                                       ],function(err, result){
//                                                         if(result !== null){
//                                                             var tanggal = today();
//                                                             const data = {
//                                                                     source: 'Instagram',
//                                                                     text: comment.caption,
//                                                                     foto: 'none.jpg',
//                                                                     category: result,
//                                                                     date : tanggal
//                                                                 }

//                                                                 var Train = new uji(data);
//                                                                 Train.save((err) => {
//                                                                     if (err)
//                                                                         console.log(err);

//                                                                     console.log("saved instagram");
//                                                                 })
//                                                         }else{
//                                                             console.log("error");
//                                                         }
                                                        
//                                       });
                                              
//                                     });
//                                 });

//                             }
//                 ], function (err, result) {
                                
//                 }); //end waterfall
//               // console.log(val.id)
       
//   },

//   start: true,
//   timeZone: 'Asia/Jakarta',
// })
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
