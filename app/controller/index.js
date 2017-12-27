const train = require('../model/training');
const axios = require('axios');

function Index(){
	// this.getDashoard = (req, res, next) =>{
	// 	train.
	// }

	this.getTrain = (req, res, next)=>{
		res.render('train');
	}
	this.postTrain = (req, res, next)=>{
		axios.get('https://unikom-sentiment-analysis.herokuapp.com/api/v1/train')
		.then(function (response) {
			res.json("success")
		})
		.catch(function (error) {
			console.log(error);
			res.json("error");
		});
	}

}

module.exports = new Index();