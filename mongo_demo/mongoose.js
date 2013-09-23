var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:8000/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('yay');
});

// Create schema
var kittySchema = mongoose.Schema({
	name: String
});
// add some methods to schema
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function() {
	var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
	console.log(greeting);
};

// Create model
var Kitten = mongoose.model('Kitten', kittySchema);
var silence = new Kitten({name: 'Silence'});
silence.save(function(err, silence) {
	if (err)
		console.log(err);
		
	fluffy.speak();
});

var fluffy = new Kitten({name: 'fluffy'});
//fluffy.speak();
// Let's find document fluffy
Kitten.find(function(err, kittens) {
	if (err)
		console.log(err);
		
	console.log(kittens);
});