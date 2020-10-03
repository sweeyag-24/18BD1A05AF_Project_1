//mongodb
const MongoClient=require('mongodb').MongoClient;

var express = require("express");
var app = express();

//bodyParser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Connection of server file for AWT
let server=require('./server');
let middleware=require('./middleware');


//Connection of mongodb with nodejs
const url='mongodb://127.0.0.1:27017';
const dbName='Hospital_Inventory';

let db
MongoClient.connect(url,{useUnifiedTopology: true},
   (err,client)=>
{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected database: ${url}`);
    console.log(`Database : ${dbName}`);
});

//Fetching hospital Details

app.get('/hospitaldetails',middleware.checkToken, function(req,res)
{
  console.log("Fetching data from Hospital collections");
  var data=db.collection('hospital').find({}).toArray().then(result => res.json(result));

});

//Fetching Ventilator Details

app.get('/ventilatorsdetails',middleware.checkToken, function(req,res)
{
  console.log("Fetching data from ventilators collections");
  var data=db.collection('ventilators').find({}).toArray().then(result =>res.json(result));
});

//Add Hospital data
app.post('/addhospitaldetails',middleware.checkToken, function(req,res)
{
    console.log(req.body);
    db.collection("hospital").insertOne(req.body, function (err, hospital)
     {
      if (err) throw err;
      res.json("hospital added");
    });
});

//Add ventilator data
app.post('/addventilatordetails',middleware.checkToken, function(req,res)
{
    console.log(req.body);
    db.collection("ventilators").insertOne(req.body, function (err, ventilators) 
    {
      if (err) throw err;
      res.json("ventilator added");
    });
});


//delete hospital details
app.delete('/deletehospital',middleware.checkToken,function(req,res)
{
  var myQuery=req.query.hospitalId;
  console.log(myQuery);

  var myQuery1={hId:myQuery};
  db.collection("hospital").deleteOne(myQuery1, function (err, obj) 
  {
    if (err) throw err;
    else res.json("Hospital deleted");
  });
});

//delete ventilator
app.delete('/deleteventilator',middleware.checkToken,function(req,res)
{
  var myQuery=req.query.ventilatorId;
  console.log(myQuery);

  var myQuery1={ventilatorId:myQuery};
  db.collection("ventilators").deleteOne(myQuery1, function (err, obj) 
  {
    if (err) throw err;
    else res.json("Ventilator deleted");
  });
});


//search hospital by name
app.post('/searchhospital',middleware.checkToken,function(req,res){
  var name=req.query.name;
  console.log(name);
  var hospitaldetails=db.collection('hospital').find({"name":new RegExp(name, 'i')}).toArray().then(result => res.json(result));
})




//search ventilator by status
app.post('/searchventilatorbystatus',middleware.checkToken,function(req,res)
{
  var status=req.body.status;
  console.log(status);
  var ventilatorsdetails=db.collection('ventilators').find({"status":status}).toArray().then(result =>res.json(result));


});

//search ventilators by hospital name
app.post('/searchventilatorbyname',middleware.checkToken,function(req,res)
{
  var name=req.body.name;
  console.log(name);
  var ventilatorsdetails=db.collection('ventilators').find({"name":new RegExp(name, 'i')}).toArray().then(result =>res.json(result));


});



//update hospital details
app.put('/updatehospitaldetails', middleware.checkToken, function(req,res)
{
  var hospId={hospitalId:req.body.hospitalId};
  console.log(hospId);
  var newdata={ $set:req.body};
  db.collection("hospital").updateOne(hospId,newdata,function(err,result)
  {
    if(err) throw err;
    res.json('1 document update');
    //
  });
});

//update ventilator
app.put('/updateventilatordetails',middleware.checkToken,function(req,res)
{
  var ventId={ ventilatorId: req.body.ventilatorId};
  console.log(ventId);
  var newdata={ $set: { status: req.body.status}};
  db.collection("ventilators").updateOne(ventId,newdata,function(err,result)
  {
    if(err) throw err;
    res.json('1 document update');
  });

});




app.listen(3030);