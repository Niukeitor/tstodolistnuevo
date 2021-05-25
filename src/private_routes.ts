/**
 * Pivate Routes are those API urls that require the user to be
 * logged in before they can be called from the front end.
 * 
 * Basically all HTTP requests to these endpoints must have an
 * Authorization header with the value "Bearer <token>"
 * being "<token>" a JWT token generated for the user using 
 * the POST /token endpoint
 * 
 * Please include in this file all your private URL endpoints.
 * 
 */
import { Router } from 'express';
import { safe } from './utils';
import * as actions from './actions';

const router = Router();

router.get('/user', safe(actions.getUser));
router.get('/user:id', safe(actions.getUser));
router.get('/user:id', safe(actions.updateUser));
/*router.get('/todo/user:id', safe(actions.createTodo));
router.get('/todos/user', safe(actions.getTodo));
router.get('/todos/user/:id', safe(actions.getTodo));
router.get('/todos/user/:id', safe(actions.updateTodo));
router.get('/todos/user/:id', safe(actions.deleteUser));*/

export default router;
