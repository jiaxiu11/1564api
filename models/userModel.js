import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

export const userBoardSchema = new Schema({
  boardId: {
    type: String,
    required: true
  },
  boardTitle: {
    type: String,
    default: 'Untitled Board'
  },
  mode: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});
//this userBoard Schema, stores only the title and mode -- info needed by the
//dashboard. we store the specific notes in boardSchema.


export const userSchema = new Schema({
  username: {
    type: String
    //,required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashPassword: {
    type: String,
    required: true
  },
  boards : {
    type: [userBoardSchema],
    default: []
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};
