const mongoose= require('mongoose');
var Schema=mongoose.Schema;
const express = require('express');
var bodyParser = require('body-parser');

const app=express();
app.use(express.static('public'));


var con;
mongoose.connect("mongodb://localhost/mydb",function(err){
	if(err) throw err;
	console.log('connected to db');
});

con=mongoose.connection;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))


var CartSchema =new Schema({
	 name : {type:String,required:true},
	 description : {type:String},
	 price : {type:Number},
	 quantity: {type:Number},
});

var CartModel=mongoose.model('shop',CartSchema);

app.get('/home',function(req,res){
   res.sendFile(__dirname+'/home.html');
});

app.post('/add',function (req,res) {
	var item= new CartModel(
	{
           name : req.body.name,
           description : req.body.description,
           price : req.body.price,
           quantity : req.body.quantity
	});
	item.save(function(err,result){
       if(err) 
       	{ 
       		console.log('save failed' + err);
  		 }
       else console.log('save succes');
	});
	 res.sendFile(__dirname+'/home.html');
})

app.post('/del',function(req,res){
   console.log(req.query.dname);
   CartModel.findOneAndRemove({name: req.query.dname},function(err,result){
   	if(err) throw error;
   	console.log("deleted : "+result);
   });
    res.sendFile(__dirname+'/home.html');

});

app.post('/show',function(req,res)
{
	CartModel.find({},function(err,result)
	{
		if(err) throw err;
		console.log(result);
		res.status(200).json(result);
	})

})

var ser=app.listen(8080,function(req,res){
	console.log('server is on');
});