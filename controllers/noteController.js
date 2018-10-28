import mongoose from 'mongoose';
import {noteSchema, cardSchema, boardSchema} from '../models/1564models';
import{ Board } from './boardController';
import algoliasearch from 'algoliasearch';

export const client = algoliasearch('99OSTG262A', 'db94d58b49cf8810a23e5b2e1fecfefc');
export const index = client.initIndex('prod_NOTES');
index.setSettings({attributesForFaceting: ["boardId"],
attributesToHighlight: [
  'noteTitle',
  'cards'
],highlightPreTag: '<b class = "highlight">',
highlightPostTag: '</b>'}, function(err, content) {
      console.log(content);
    });


export const addNewNote = (req, res) => {
  Board.findById(req.params.boardId, (error, parentBoard) => {
    if(error) {
      res.send(error);
    }
    var newNote = parentBoard.notes.create(req.body);
    //add object to algolia index
    var objectID = newNote._id;
    index.addObject({boardId : req.params.boardId,
      objectID: objectID, ...req.body}, function(err, content) {
      console.log(content);
    });
    //continue saving the newnote
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
    //update algolia indexing
    index.partialUpdateObject({objectID: req.params.noteId, ...req.body},
      function(err, content) {
        if (err) throw err;
        console.log(content);
      });
    //continue updating note in database
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
    //delete from algolia index
    index.deleteObject(`${req.params.noteId}`, function(err, content) {
      if (err) throw err;
      console.log(content);
    });
    //deleting from database
    parentBoard.notes.id(req.params.noteId).remove();
    parentBoard.save((err, note) => {
        if(err) {
          res.send(err);
        }
        res.json({message : 'delete successful'});
    });
});
};
