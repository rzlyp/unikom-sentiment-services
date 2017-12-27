var ig = require('instagram-tagscrape');
 



function Instagram(){
	this.postSrcHashTag = (req, res, next) =>{

		ig.scrapeTagPage(req.body.src).then(function(result){
		    res.json(result);
		})

	}
	this.getHashtag = (req, res, next) =>{
		res.render('ig');
	}
}

module.exports = new Instagram();