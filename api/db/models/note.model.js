const mongoose = require('mongoose');

const NoteSchema  = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength:1
    },
    _listId:{
        type: mongoose.Types.ObjectId,
        required : true
    },
    
    //content:String,
    //dateCreated: Date,
    //dateUpdated: Date,
    //owner: String,
    //shared: String, 
    completed:{
        type: Boolean,
        default: false
    },
})

const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note};