var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    email: {type: String, required:true},
    password: {type: String, required: true},
});

userSchema.methods.checkPassword = function(password) {
    return password === this.password;
}

module.exports = mongoose.model('User', userSchema);
