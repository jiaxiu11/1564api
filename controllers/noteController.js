import mongoose from 'mongoose';
import {noteSchema, cardSchema, boardSchema} from '../models/1564models';
import{ Board } from './boardController';

export const addNewNote = (req, res) => {
  Board.findById(req.params.boardId, (error, parentBoard) => {
    if(error) {
      res.send(error);
    }
    var newNote = parentBoard.notes.create(req.body);
    parentBoard.notes.push(newNote);
    parentBoard.save((err, board) => {
        if(err) {
          res.send(err);
        }
        res.json(newNote); //send back the note added
    })
  });
}

export const getNotes = (req, res) => {
  Board.findById(req.params.boardId, (error, parentBoard) => {
    if(error) {
      res.send(err);
    }
    res.json(parentBoard);//we send over the whole board here
    //res.json(parentBoard.notes);

  });
};

//for update and delete we only have note id
export const updateNote = (req, res) => {
  Board.findOne({'notes._id': `${req.params.noteId}`}, (error, parentBoard) => {
    if (error) {
      res.send(err);
    }
    var newNote = parentBoard.notes.id(req.params.noteId).set(req.body);
    parentBoard.save((err, board) => {
        if(err) {
          res.send(err);
        }
        res.json(newNote);
    });
});
}

export const deleteNote = (req, res) => {
  Board.findOne({'notes._id': `${req.params.noteId}`}, (error, parentBoard) => {
    if (error) {
      res.send(err);
    }
    parentBoard.notes.id(req.params.noteId).remove();
    parentBoard.save((err, note) => {
        if(err) {
          res.send(err);
        }
        res.json({message : 'delete successful'});
    });
});
};




/*
i'll save the orginal code here

export const Note = mongoose.model('Note', noteSchema);
export const getCardWithId = (req, res) => {
  Note.findById(req.params.noteId, (error, parentNote) => {
    if (error) {
      res.send(err);
    }
    var card = parentNote.cards.id(req.params.cardId);
    res.json(card);
  });
};//i'll just leave it here first, might not use it


export const addNewNote = (req, res) => {
  let newNote = new Note(req.body);

  newNote.save((err, note) => {
    if (err) {
      res.send(err);
    }
    res.json(note);
  });
};

export const getNotes = (req, res) => {
  Note.find({}, (err, notes) => {
    if (err) {
      res.send(err);
    }
    res.json(notes);
  });
};

export const getNoteWithId = (req, res) => {
  Note.findById(req.params.noteId, (error, note) => {
    if (err) {
      res.send(err);
    }
    res.json(note);
  });
};//i'll just leave it here first, might not use it

export const updateNote = (req, res) => {
  //console.log(typeof req.params.noteId)
  Note.findOneAndUpdate({_id : req.params.noteId},//or {_id: req.params.noteId}
req.body, {new : true}, (err, note) => { //the new option tells it to return the updated one
  if (err) {
    res.send(err);
  }
  res.json(note);
});
};

export const deleteNote = (req, res) => {
  Note.remove({_id: req.params.noteId}, (err, note) => {
  if (err) {
    res.send(err);
  }
  res.json({message: 'delete successful'});
});
};

*/
