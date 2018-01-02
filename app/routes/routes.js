var express = require('express');
var multer = require('multer');
var fs = require('fs');
var jsonfile = require('jsonfile');

var synapse = require('../model/synapse');
var ps = require('../model/preprocessing');
var router = express.Router();

var index = require('../controller/api/index');

router.get('/sentiment', index.getSentiment);
router.get('/comment', index.getComment);
router.post('/upload-synapse', (req, res, next) => {

  var storage = multer.diskStorage({
    filename: function (req, file, callback) {
      console.log(file);
      callback(null, file.originalname);
    }
  });
  var upload = multer({ storage: storage }).single('json');
  upload(req, res, function (err) {

    if (err)
      console.log(err);

    console.log(req.file.path);

    var file = req.file.path;
    jsonfile.readFile(file, function (err, obj) {
      const data = {
        synapse0: obj.synapse0,
        synapse1 : obj.synapse1,
        words : obj.words
      }
      synapse.remove({}, () => {
        console.log('remove synapse');
      });
      var syn = new synapse(data);
      syn.save((err) => {
        if (err)
          console.log(err);

        res.json({ status_code: 201, message: "Success upload synapse json" });
      });
    })

  });
});

router.post('/upload-ps', (req, res, next) => {

  var storage = multer.diskStorage({

    filename: function (req, file, callback) {
      console.log(file);
      callback(null, file.originalname);
    }
  });
  var upload = multer({ storage: storage }).single('json');
  upload(req, res, function (err) {

    if (err)
      console.log(err);

    console.log(req.file.path);



    var file = req.file.path;
    jsonfile.readFile(file, function (err, obj) {
      const data = {
        data: obj
      }
      ps.remove({}, () => {
        console.log('remove ps');
      });
      var syn = new ps(data);
      syn.save((err) => {
        if (err)
          console.log(err);

        res.json({ status_code: 201, message: "Success upload processing json" });
      });
    })

  });
});

module.exports = router;