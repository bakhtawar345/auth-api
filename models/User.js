const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    //schema is a set of rules that describes what ur data should look like
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:[ 'admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
//makes the user model available to other files that need it eg, routes