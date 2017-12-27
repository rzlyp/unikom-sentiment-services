var Twit = require('twit');
var async = require('async');
var train = require('../model/training');
var axios = require('axios');
var uji = require('../model/datatest');

function Twitter(){
	this.srcTweet = (req, res, next) =>{
		var T = new Twit({
		  consumer_key:         'rn6vG9oH3PqQTtXOFibPEhRGT',
		  consumer_secret:      'lDAcGsiwye3sbjRzEp3eXtHvAEsomx6LF27xuhUpoAFk7lCkrk',
		  access_token:         '1261496917-1j5yJrv1vnBqCy72eAbPcBxKba03r0ke9NqisAa',
		  access_token_secret:  'OhMP4xSHq0txOtaioVfPk2ylbZXIciP99CE8YxQbpNiyc',
		  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
		});

		    	let params = {
				    q: req.body.src,
				    count: 500,
				    lang: 'id',
				    result_type: 'mixed',
				  };
		        T.get('search/tweets', params, function(err, data, response) {
				  	res.json(data);
				})
		   
	}
	this.getTweet = (req, res, next) =>{
		res.render('twit');
	}
	this.postSave = (req, res, next) =>{
		var check = train.find({text : req.body.text }, (err, doc) =>{

				if(doc.length > 0){
					res.json({
						status_code : 400,
						message : 'Text already exist !'
					});
				}else{
					const data = {
						source : req.body.source,
						text : req.body.text,
						foto_sender : req.body.foto_sender,
						category : req.body.category
					}

				var Train = new train(data);
				Train.save((err)=>{
					if(err)
						console.log(err);

					res.json({
							status_code : 201,
							message : 'Category Succesfully saved !'
						});
				});
			}
				
			
		});
		


	}
	this.getData = (req, res, next) =>{

		var data = train.find({}, (err,doc)=>{
			if(err)
				console.log(err);

			res.render('training', {data : doc});
		});
	}
	this.getTest = (req, res, next)=>{
		var data = uji.find({}, (err,doc)=>{
			if(err)
				console.log(err);

			res.render('test', {data : doc});
		});
	}
	this.getMostWord = (req, res, next) =>{
		train.aggregate([
			{
		        $project: {
		            words: { $split: ["$text", " "] }
		        }
		    },
		    {
		        $unwind: {
		            path: "$words"
		        }
		    },
		    {
		        $group: {
		            _id: "$words",
		            count: { $sum: 1 }
		        }
		    }
		], (err, doc)=>{
			if(err)
				console.log(err);

			res.json(doc);
		});
	}
	this.postAnalize = (req, res, next)=>{
		axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
		    text: 'bangat peteu'
		  })
		  .then(function (response) {
		    var data = (response.data).result;
		    if(data.length > 1){
		    	if(data[0][1] > data[1][1]){
		    		console.log("jahat menang ya :( "+data[0][0]);
		    	}else{
		    		console.log("justice !");
		    	}
		    }
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	}
	this.getDataUji = (req, res, next)=>{
		var T = new Twit({
		  consumer_key:         'rn6vG9oH3PqQTtXOFibPEhRGT',
		  consumer_secret:      'lDAcGsiwye3sbjRzEp3eXtHvAEsomx6LF27xuhUpoAFk7lCkrk',
		  access_token:         '1261496917-1j5yJrv1vnBqCy72eAbPcBxKba03r0ke9NqisAa',
		  access_token_secret:  'OhMP4xSHq0txOtaioVfPk2ylbZXIciP99CE8YxQbpNiyc',
		  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
		});

		    	let params = {
				    q: 'unikom',
				    count: 500,
				    lang: 'id',
				    result_type: 'mixed',
				  };
		        T.get('search/tweets', params, function(err, data, response) {
		        	var category = '';
		        	(data.statuses).map((val)=>{
		        			axios.post('https://unikom-sentiment.herokuapp.com/api/v1/classify', {
							    text: val.text
							  })
							  .then(function (response) {
							    var hasil = (response.data).result;
							    if(hasil.length > 1){
							    	if(hasil[0][1] > hasil[1][1]){
							    		category = hasil[0][0]
							    	}else{
							    		category = hasil[1][0];
							    	}
							    }else{
							    	category = 'Negatif';
							    }

									    var check = uji.find({text : val.text }, (err, doc) =>{

											if(doc.length > 0){
												console.log("Already exist");
											}else{
												const data = {
													source : 'Twitter',
													text : val.text,
													foto_sender : val.user.profile_image_url,
													category : category
												}

											var Train = new uji(data);
											Train.save((err)=>{
												if(err)
													console.log(err);

												console.log("saved");
											});
										}
											
										
									});
							  })
							  .catch(function (error) {
							    console.log(error);
							  });
				      });
				  	
				});
	}
}

module.exports = new Twitter();