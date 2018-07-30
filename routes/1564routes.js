import { addNewNote, getNotes,
updateNote, deleteNote } from '../controllers/noteController';
import { addNewCard, getCards,
updateCard, deleteCard } from '../controllers/cardController'
import { login, register, loginRequired } from '../controllers/userController';
import { addNewBoard, getBoards,
updateBoard, deleteBoard } from '../controllers/boardController'

const routes = (app) => {
  app.route('/board/:userId')
  .get(loginRequired, getBoards)
  .post(loginRequired, addNewBoard);

  app.route('/board/:boardId')
  .put(loginRequired, updateBoard)
  .delete(loginRequired, deleteBoard);



  app.route('/note/:boardId')
  .get((req, res, next) => {
    //demo of the middleware
    console.log(`Request from: ${req.originalUrl}`);
    console.log(`Request type: ${req.method}`);
    next();
  }, loginRequired, getNotes)
  .post(loginRequired, addNewNote);

  app.route('/note/:noteId')
  .put(loginRequired, updateNote)
  .delete(loginRequired, deleteNote);

  app.route('/card/:noteId')
  .get(loginRequired, getCards)
  .post(loginRequired, addNewCard);

  app.route('/card/:noteId/:cardId')
  .put(loginRequired, updateCard)
  .delete(loginRequired, deleteCard);

  app.route('/auth/register')
  .post(register);

  app.route('/auth/login')
  .post(login);
}

export default routes;
