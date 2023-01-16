const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');
const ObjectId = mongoose.Types.ObjectId;

const bodyParser = require('body-parser');

//Load in the mongoose models
const {List, Note, User} = require('./db/models');

const jwt = require('jsonwebtoken');
const { response } = require('express');

//** Middleware */

//Load middleware
app.use(bodyParser.json());

//cors headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //http://localhost:4200
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    next();
  });

// check if request has valid JWT token
  let authenticate = (req, res, next)=>{
    let token = req.header('x-access-token');

    //verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded)=>{
        if(err){
            //there is error
            //jwt is inavlid so dont authenticate
            res.status(401).send(err);
        }else{
            //jwt is valid
            req.user_id= decoded._id;
            next();
        }
    })
  }



  //Verify refresh token middleware which will be verifying the session
  let verifySession=(req,res,next)=> {
    //grab the refresh token from the request header
  let refreshToken = req.header('x-refresh-token');
  // grab the _id from the request header
  let _id = req.header('_id');

  User.findByIdAndToken(_id, refreshToken).then((user)=>{
      if(!user){
          //user couldn't be found
          return Promise.reject({
              'error': 'User not found. Make sure that th eredresh token and id are correct'
          })
      }

      //if the code reaches here -user was found
      // therefore the refresh token exists in data base but we still have to check if it has expired or not

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session)=>{
          if(session.token === refreshToken){
              //chek if the session token expired
              if(User.hasRefreshTokenExpired(session.expiresAt)===false){
                  //refresh token not expired
                  isSessionValid = true;
              }
          }
      })

      if(isSessionValid){
          // the session is valid - call next() to contionue with processing this web request
          next();

      }else{
          //if session is not valid
          return Promise.reject({
              'error': 'Refresh token has expired or the session is invalid'
          })
      }
  }).catch((e)=>{
      res.status(401).send(e);
  })
} 

/*Route handlers*/

//////////////////////////////////////////////
/*List routes*/

app.get('/lists', authenticate, (req,res)=>{
    List.find({
        _userId: req.user_id
    }).then((lists)=>{
        res.send(lists);
    }).catch((e)=>{
        res.send(e);
    })
})
//return an array of all lists in the database that belong to the authenticated user

// app.get('/lists/:listId', (req,res)=>{
//     List.findById({
//         _id:req.params.listId,
//     }).then((list)=>{
//         res.send(list);
//     })
// })


app.post('/lists', authenticate, (req, res)=>{
    //creating new list and return the new list doc back to the user (which inxludes id)
    //the list fields will be passed in via JSON request body
    let title= req.body.title;

    let newList= new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc)=>{
        res.send(listDoc);
    })
})


//create a new list and return the new list document back to the user (which includes id)
//The list info (fields) are passed in via the JSON request body

app.patch('/lists/:id', authenticate, (req, res)=>{
    List.findByIdAndUpdate({
        _id: req.params.id, _userId: req.user_id}, {
        $set: req.body
    }).then(() => {
        res.send({'message':'updated successfully'});
    });
});
//To update specified list (list doc with id in the URL) with the new values specified in JSON body of the request

app.delete('/lists/:id', authenticate, (req, res)=>{
    List.findByIdAndDelete({
        _id: req.params.id, 
        _userId: req.user_id
    }).then((removedListDoc)=>{
        res.send(removedListDoc);

        //delete all tasks that are in deleted list
        deleteNotesFromList(removedListDoc._id);
    })
})
//To delete specified list (list doc with id in the URL) with the new values specified in JSON body of the request


//////////////////////////////////////////////
/*Note routes*/

app.get('/lists/:listId/notes', authenticate, (req, res)=>{
    Note.findById({
        _listId: req.params.listId
    }).then((notes) =>{
        res.send(notes);
    })
})

//To return all notes that belong to a sprecific list (specified by listId)
// app.get('/lists/:listId/notes/noteId', (req,res)=>{
//     Note.findOne({
//         _id:req.params.noteId,
//         _listId:req.params.listId
//     }).then((note)=>{
//         res.send(note);
//     })
// })

app.post('/lists/:listId/notes', authenticate, (req,res)=>{
    //create a new note in list specified by listId
    List.findOne({
        _id:req.params.listId,
        _userId: req.user_id
    }).then((list)=>{
        if(list){
            //list object with specified conditions is found
            //so the currently authenticated user can create new notes
            return true;
        }
        //else -list object is undefined
        return false;
    }).then((canCreateNote)=>{
        if(canCreateNote){
            let newNote = new Note({
                title:req.body.title,
                _listId: req.params.listId
            });
            newNote.save().then((newNoteDoc)=>{
                res.send(newNoteDoc);
            })
        }else{
            response.sendStatus(404);
        }
    })

  
})

app.patch('/lists/:listId/notes/:noteId', authenticate, (req,res)=>{
    //update an existing note (specified by noteId )

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list)=>{
        if(list){
            //list object with specified conditions is found
            //so the currently authenticated user can make updates to notes in this list
            return true;
        }
        //else - the list object is undefined
        return false;
    }).then((canUpdateNotes)=>{
        if(canUpdateNotes){
            // the currently authenticated user can update notes
            Note.findOneAndUpdate({
                _id:req.params.noteId,
                _listId:req.params.listId
            },{
                $set: req.body
            }).then(()=>{
                res.send({message:'Updated successfully'})
            })

        }else{
            response.sendStatus(404);
        }
    })

  
})

app.delete('/lists/:listId/notes/:noteId', authenticate, (req,res)=>{

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list)=>{
        if(list){
            //list object with specified conditions is found
            //so the currently authenticated user can make updates to notes in this list
            return true;
        }
        //else - the list object is undefined
        return false;
    }).then((canDeleteNotes)=>{

        if(canDeleteNotes){
            Note.findByIdAndRemove({
                _id:req.params.noteId,
                _listId:req.params.listId
            }).then((removedNoteDoc)=>{
                res.send(removedNoteDoc);
            })
        }else{
            res.sendStatus(404);
        }

     
    })
})

/** User routes */

app.post('/users', (req, res)=>{
    //user sign up
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(()=>{
        return newUser.createSession();
    }).then((refreshToken)=>{
        //Session created successfully
        //now generate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken)=>{
            //access auth token generated successfully, now we return an object containing the auth tokens
            return {accessToken, refreshToken}
        });
    }).then((authTokens)=>{
        //now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser)
    }).catch((e)=>{
        res.status(480).send(e);
    })
})

app.post('/users/login', (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user)=>{
        return user.createSession().then((refreshToken)=>{
            //session created successfully -refreshToken returned
            //now we generate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken)=>{
                //access auth token generated successfully, now we return an object containing the autj tokens
                return {accessToken, refreshToken}
            })
        }).then((authTokens)=>{
            //construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user)
        })
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

app.get('/users/me/access-token', verifySession, (req,res)=>{
    // user is authenticated and we have user id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken)=>{
        res.header('x-access-token', accessToken).send({accessToken})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//** Helper methods */
let deleteNotesFromList = (_listId)=>{
    Note.deleteMany({
        _listId
    }).then(()=>{
        console.log("tasks from " + _listId + "were deleted!");
    })
}

app.listen(3000, ()=>{
    console.log('Server is listening on port 3000');
})