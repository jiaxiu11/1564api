import mongoose from 'mongoose';
import {noteSchema, cardSchema, boardSchema} from '../models/1564models';
import{ User } from './userController';
import { userBoardSchema } from '../models/userModel';




export const Board = mongoose.model('Board', boardSchema);//this is the board collection



// getBoards
// addNewBoard
// updateBoard
// deleteBoard



export const addNewBoard = (req, res) => {
  let newBoard = new Board(req.body);

  newBoard.save((err, board) => {//saved in the boards collection. with boardTitle, mode, _id
    if (err) {
      res.send(err);
    }
    //now find the user and save userBoardSchema to the user collection
    var saveWithUser = {
      boardId: board._id,
      boardTitle: board.boardTitle,
      mode: board.mode
    }
    User.findById(req.params.userId, (error, user) => {
      if(error) {
        res.send(err);
      }
      var newUserBoard = user.boards.create(saveWithUser);

      user.boards.push(newUserBoard);
      user.save((err, user) => {
          if(err) {
            res.send(err);
          }
          res.json(newUserBoard); //pass the newBoard back to client
      })
    });
    //--------------------------

  });
};

//actually this is get user, we return the user object whose boards attribute contains the boards
export const getBoards = (req, res) => {
  User.findById(req.params.userId, (error, user) => {
    if(error) {
      res.status(400).send( {
        message: 'Unauthorized user,please login.'
      });
      return;
    }
    if(!user) {
      res.json({message: 'Unauthorized user,please login.'});
    }
    user.hashPassword = undefined;
    res.json(user);
  });
};


// export const getNoteWithId = (req, res) => {
//   Note.findById(req.params.noteId, (error, note) => {
//     if (err) {
//       res.send(err);
//     }
//     res.json(note);
//   });
// };//i'll just leave it here first, might not use it

export const updateBoard = (req, res) => {
  //update the boardTitle in the boards collection first
  Board.findOneAndUpdate({_id : req.params.boardId},//or {_id: req.params.noteId}
req.body, {new : true}, (err, board) => { //the new option tells it to return the updated one
  if (err) {
    res.send(err);
  }
  //res.json(board);
});
//then update the boardTitle in the users collection
User.findOne({'boards.boardId': `${req.params.boardId}`}, (error, user) => {
  if (error) {
    res.send(err);
  }
  //res.json(user);
  var allBoards = user.boards;
  for(var i = 0; i < allBoards.length; i++) {
    var board = allBoards[i];
    if(board.boardId === req.params.boardId) {
      board.set(req.body);
      user.save((err, user) =>{
        if(err) {
          res.send(err);
        }
        res.json(board);//send back the board
      });
    }
  }
});
};

export const deleteBoard = (req, res) => {
  //delete from the Board collection
  Board.remove({_id: req.params.boardId}, (err, note) => {
  if (err) {
    res.send(err);
  }
  //res.json({message: 'delete successful'});
});
User.findOne({'boards.boardId': `${req.params.boardId}`}, (error, user) => {
  if (error) {
    res.send(err);
  }
  var allBoards = user.boards;
  var board;
  for(var i = 0; i < allBoards.length; i++) {
    var board = allBoards[i];
    if(board.boardId === req.params.boardId) {
      board.remove();
      user.save((err, user) =>{
        if(err) {
          res.send(err);
        }
        res.json({message: 'delete successful'});//send back the board
      });
    }
  }
});
};
