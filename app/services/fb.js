const fb = require('fb');
const CronJob = require('cron').CronJob;
const ig = require('instagram-tagscrape');
const axios = require('axios');
const async = require('async');
const request = require('request');
const uji = require('../model/datatest');

/**
 * @param cronIF cron job to get comment from fanspage Teknik Informatika UNIKOM
 165292613289/posts?fields=created_time,story,message,shares,reactions.type(LIKE).limit(0).summary(1).as(like),reactions.type(LOVE).limit(0).summary(1).as(love),reactions.type(HAHA).limit(0).summary(1).as(haha),reactions.type(WOW).limit(0).summary(1).as(wow),reactions.type(SAD).limit(0).summary(1).as(sad),reactions.type(ANGRY).limit(0).summary(1).as(angry)&limit=10
 */

fb.setAccessToken('1935709619975639|fKTU1R1DAHAALrnsDzc7r37n57U');

const cronIF = new CronJob({
  cronTime: '0 */50 * * * *',

  onTick() {
    console.log("check fanspage ..")
        fb.api("/165292613289/posts", (response)=> {
                if (response && !response.error) {
                    // console.log(response);
                    
                  (response.data).forEach((val)=>{
                        var annoucement = {};
                        var comments = [];
                        annoucement.text = val.message;
                        console.log(val.id);
                        async.waterfall([
                            function (callback) {
                                fb.api("/" + val.id + "/comments", (response)=> {
                                    annoucement.commentCount = (response.data).length;
                                        if (response && !response.error) {
                                            (response.data).forEach((comment)=>{
                                               async.waterfall([
                                                   function (callback){
                                                       var check = uji.find({ text: comment.message }, (err, doc) => {
                                                           if (doc.length > 0) {
                                                            console.log("Already exist");
                                                            } else {
                                                                var category = '';
                                                        const texts =  JSON.stringify({

                                                               "Inputs": {
                                                                  "input1": [
                                                                    {
                                                                      "Tweet" : comment.message,
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
                                                                    comments.push({
                                                                        comment : comment.message,
                                                                        category : category,
                                                                        date : today()
                                                                    })
                                                                    // var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                    //         saveWord.save();
                                                                            callback(null, category);
                                                                 });
                                                              });
                                                                // axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
                                                                //     text: comment.message
                                                                // })
                                                                //     .then(function (response) {
                                                                //         // console.log(response.data)
                                                                //         if(response.data.status_code !== 400){
                                                                //             var hasil = (response.data).result;
                                                                //             if (hasil.length > 1) {
                                                                //                 if (hasil[0][1] > hasil[1][1]) {
                                                                //                     category = hasil[0][0]
                                                                //                 } else {
                                                                //                     category = hasil[1][0];
                                                                //                 }
                                                                //             } else {
                                                                //                 category = hasil[0][0];
                                                                //             }
                                                                //             console.log(response.data.words);
                                                                //             var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                //             saveWord.save();
                                                                //             callback(null, category);
                                                                //         }
                                                                //         callback(null,null);
                                                                        
                                                                //     })
                                                                //     .catch(function (error) {
                                                                //         console.log(error.response);
                                                                //     });
                                                            }
                                                       });
                                                        

                                                        
                                                   }
                                                   
                                               ], function (err, result) {
                                                   if(result !== null){
                                                       console.log(annoucement);
                                                            var check = uji.find({ text: comment.message }, (err, doc) => {

                                                            if (doc.length > 0) {
                                                                console.log("Already exist 2");
                                                            } else {
                                                                var tanggal = today();
                                                                const data = {
                                                                    source: 'Facebook',
                                                                    text: annoucement.text,
                                                                    foto_sender: 'none.jpg',
                                                                    category: 'Positif',
                                                                    date : tanggal,
                                                                    commentCount : comments.length,
                                                                    comment : comments
                                                                }

                                                                var Train = new uji(data);
                                                                Train.save((err) => {
                                                                    if (err)
                                                                        console.log(err);

                                                                    console.log("saved facebook");
                                                                })
                                                            }
                                                        });//end find
                                                   }else{
                                                       console.log("not train");
                                                   }
                                                    
                                  }); //end waterfall
                          }); //endforeach
                    } else {
                        console.log(response.error);
                    }
                }); //end facebook
            } 
        ]); //end waterfall
    }); //endforeach
    } //fb get post if
    }); //fb post
  },

  start: true,
  timeZone: 'Asia/Jakarta',
});
/**
  GET REACTIONS
*/
// const cronReact = new CronJob({
//   cronTime: '0 */50 * * * *',

//   onTick() {
//     console.log("check fanspage to get reaction..")
//         fb.api("/165292613289?fields=posts.as(like){reactions.type(LIKE).limit(0).summary(true)}, posts.as(love){reactions.type(LOVE).limit(0).summary(true)}, posts.as(wow){reactions.type(WOW).limit(0).summary(true)},   posts.as(haha){reactions.type(HAHA).limit(0).summary(true)},   posts.as(sad){reactions.type(SAD).limit(0).summary(true)},   posts.as(angry){reactions.type(ANGRY).limit(0).summary(true)},   posts.as(thankful){reactions.type(THANKFUL).limit(0).summary(true)}", (response)=> {
            
//                 if (response && !response.error) {
//                     // console.log(response);
                    
//                   async.parallel({
//                       like : (callback)=>{
//                         (response.like).forEach((react)=>{

//                         })
//                       },
//                       wow : (callback)=>{

//                       },
//                       thankful : (callback)=>{

//                       },
//                       love : (callback)=>{
//                       },
//                       sad : (callback)=>{

//                       },
//                       haha : (callback)=>{

//                       }
                    
//                   }, function(err, result){

//                   });
//               } //fb get post if
//     }); //fb post
//   },

//   start: true,
//   timeZone: 'Asia/Jakarta',
// });
/**
  GET Comment UNIKOM Master Piece
*/
const cronMasterPiece = new CronJob({
  cronTime: '0 */50 * * * *',

  onTick() {
    console.log("check fanspage master ..")
        fb.api("/985904061511946/posts", (response)=> {
            
                if (response && !response.error) {
                    // console.log(response);
                    
                  (response.data).forEach((val)=>{
                        console.log(val.id);
                        async.waterfall([
                            function (callback) {
                                fb.api("/" + val.id + "/comments", (response)=> {
                                        if (response && !response.error) {
                                            (response.data).forEach((comment)=>{
                                               async.waterfall([
                                                   function (callback){
                                                       var check = uji.find({ text: comment.message }, (err, doc) => {
                                                           if (doc.length > 0) {
                                                            console.log("Already exist");
                                                            } else {
                                                                var category = '';
                                                        const texts =  JSON.stringify({

                                                               "Inputs": {
                                                                  "input1": [
                                                                    {
                                                                      "Tweet" : comment.message,
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
                                                                //     text: comment.message
                                                                // })
                                                                //     .then(function (response) {
                                                                //         // console.log(response.data)
                                                                //         if(response.data.status_code !== 400){
                                                                //             var hasil = (response.data).result;
                                                                //             if (hasil.length > 1) {
                                                                //                 if (hasil[0][1] > hasil[1][1]) {
                                                                //                     category = hasil[0][0]
                                                                //                 } else {
                                                                //                     category = hasil[1][0];
                                                                //                 }
                                                                //             } else {
                                                                //                 category = hasil[0][0];
                                                                //             }
                                                                //             console.log(response.data.words);
                                                                //             var saveWord = new words({text : response.data.words, date : today(), category : category });
                                                                //             saveWord.save();
                                                                //             callback(null, category);
                                                                //         }
                                                                //         callback(null,null);
                                                                        
                                                                //     })
                                                                //     .catch(function (error) {
                                                                //         console.log(error.response);
                                                                //     });
                                                            }
                                                       });
                                                        

                                                        
                                                   }
                                                   
                                               ], function (err, result) {
                                                   if(result !== null){
                                                            var check = uji.find({ text: comment.message }, (err, doc) => {

                                                            if (doc.length > 0) {
                                                                console.log("Already exist 2");
                                                            } else {
                                                                var tanggal = today();
                                                                const data = {
                                                                    source: 'Facebook',
                                                                    text: comment.message,
                                                                    foto_sender: 'none.jpg',
                                                                    category: result,
                                                                    date : tanggal
                                                                }

                                                                var Train = new uji(data);
                                                                Train.save((err) => {
                                                                    if (err)
                                                                        console.log(err);

                                                                    console.log("saved facebook");
                                                                })
                                                            }
                                                        });//end find
                                                   }else{
                                                       console.log("not train");
                                                   }
                                                    
                                  }); //end waterfall
                          }); //endforeach
                    } else {
                        console.log(response.error);
                    }
                }); //end facebook
            } 
        ]); //end waterfall
    }); //endforeach
    } //fb get post if
    }); //fb post
  },

  start: true,
  timeZone: 'Asia/Jakarta',
});

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
