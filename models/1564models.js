import mongoose from 'mongoose';

const Schema = mongoose.Schema;


export const cardSchema = new Schema({
  cardContent: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

export const noteSchema = new Schema({
  animation: {
    type:String,
    default: ""
  },
  noteTitle: {
    type: String
  },
  cards : {
    type: [cardSchema],
    default: []
  },
  created_date: {
    type: Date,
    default: Date.now //this is just a demonstration of using default
  }
});

export const boardSchema = new Schema({
  boardTitle: {
    type: String,
    default : 'Untitled Board'
  },
  mode: {
    type: String,
    required: true
  },
  notes: {
    type: [noteSchema],
    default: []
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});
