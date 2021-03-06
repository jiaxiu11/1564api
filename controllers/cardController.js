import mongoose from 'mongoose';
import {cardSchema, noteShema, boardSchema} from '../models/1564models';
import { Note } from './noteController';
import { Board } from './boardController';
import algoliasearch from 'algoliasearch';
import { client, index } from './noteController';

export const addNewCard = (req, res) => {
  Board.findOne({'notes._id': `${req.params.noteId}`}, (error, parentBoard) => {
    if (error) {
      res.send(err);
    }
    var parentNote = parentBoard.notes.id(req.params.noteId);
  // parentBoard.findById(req.params.noteId, (error, parentNote) => {
  //   if(error) {
  //     res.send(error);
  //   }
    var newCard = parentNote.cards.create(req.body);
    parentNote.cards.push(newCard);
    //update algolia indexing
    index.partialUpdateObject({objectID: req.params.noteId, cards: parentNote.cards},
      function(err, content) {
        if (err) throw err;
        console.log(content);
      });
    //continue saving to mongo
    parentBoard.save((err, note) => {
        if(err) {
          res.send(err);
        }
        res.json(newCard);
    })
  });
}

export const getCards = (req, res) => {
  Board.findOne({'notes._id': `${req.params.noteId}`}, (error, parentBoard) => {
    if (error) {
      res.send(err);
    }
    var parentNote = parentBoard.notes.id(req.params.noteId);
    //res.json(parentNote);
  // Note.findById(req.params.noteId, (error, parentNote) => {
  //   if(error) {
  //     res.send(err);
  //   }
    res.json(parentNote.cards);
  });
};

// export const getCardWithId = (req, res) => {
//   Note.findById(req.params.noteId, (error, parentNote) => {
//     if (error) {
//       res.send(err);
//     }
//     var card = parentNote.cards.id(req.params.cardId);
//     res.json(card);
//   });
// };//i'll just leave it here first, might not use it

export const updateCard = (req, res) => {
  Board.findOne({'notes._id': `${req.params.noteId}`}, (error, parentBoard) => {
    if (error) {
      res.send(err);
    }
    var parentNote = parentBoard.notes.id(req.params.noteId);
  // Note.findById(req.params.noteId, (error, parentNote) => {
  //   if (error) {
  //     res.send(err);
  //   }
    var newCard = parentNote.cards.id(req.params.cardId).set(req.body);
    //update algolia indexing
    index.partialUpdateObject({objectID: req.params.noteId, cards: parentNote.cards},
      function(err, content) {
        if (err) throw err;
        console.log(content);
      });
    //continue saving to mongo
    parentBoard.save((err, note) => {
        if(err) {
          res.send(err);
        }
        res.json(newCard);
    });
});
}

export const deleteCard = (req, res) => {
  Board.findOne({'notes._id': `${req.params.noteId}`}, (error, parentBoard) => {
    if (error) {
      res.send(err);
    }
    var parentNote = parentBoard.notes.id(req.params.noteId);
  // Note.findById(req.params.noteId, (error, parentNote) => {
  //   if (error) {
  //     res.send(err);
  //   }
    parentNote.cards.id(req.params.cardId).remove();
    //update algolia indexing
    index.partialUpdateObject({objectID: req.params.noteId, cards: parentNote.cards},
      function(err, content) {
        if (err) throw err;
        console.log(content);
      });
    //continue saving to mongo
    parentBoard.save((err, note) => {
        if(err) {
          res.send(err);
        }
        res.json({message : 'delete successful'});
    });
});

};
