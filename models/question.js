var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    userID: {type: Schema.Types.ObjectId, ref: 'User'},
    pageID: {type: String, required: true},
    questionID: {type: String, required: true},
    questionData: {type: Schema.Types.Mixed}
});

// schema.methods.checkPassword = function(password) {
//     return password === this.password;
// }

module.exports = mongoose.model('Question', schema);
