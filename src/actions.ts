import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { User } from './entities/User'
import { Exception } from './utils'
import { Todo } from './entities/Todo'

export const createUser = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.first_name) throw new Exception("Please provide a first_name")
    if (!req.body.last_name) throw new Exception("Please provide a last_name")
    if (!req.body.email) throw new Exception("Please provide an email")
    if (!req.body.password) throw new Exception("Please provide a password")

    const userRepo = getRepository(User)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { email: req.body.email } })
    if (User) throw new Exception("Users already exists with this email")
    const newtodoDefault = getRepository(Todo).create()
    newtodoDefault.label = "dale"
    newtodoDefault.done = false;



    const newUser = userRepo.create()
    newUser.first_name = req.body.first_name
    newUser.last_name = req.body.last_name
    newUser.email = req.body.email
    newUser.password = req.body.password
    newUser.todos = [newtodoDefault]
    const results = await userRepo.save(newUser)
    return res.json(results);
}

export const getUsers = async (req: Request, resp: Response): Promise<Response> => {
    const user = await getRepository(User).find({ relations: ["todo"] });
    return resp.json(User);
}

export const getUser = async (req: Request, resp: Response): Promise<Response> => {
    const user = await getRepository(User).findOne(req.params.id);
    if (!User) throw new Exception("el usuario no existe.");
    return resp.json(User);
}

export const updateUser = async (req: Request, resp: Response): Promise<Response> => {
    const user = await getRepository(User).findOne(req.params.id);
    if (user) {
        getRepository(User).merge(user, req.body);
        const results = await getRepository(User).save(User);
        return resp.json(results);
    }
    else {
        return resp.status(404).json({ msg: "el usuario no existe." });
    }
}

export const createTodo = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.label) throw new Exception("Se rompio :c")
    if (!req.body.done) throw new Exception("Se rompio por 2 :c")

    const user = await getRepository(User).findOne({ relations: ["Todo"], where: { id: req.params.id } });
    if (user) {
        const newTodo = new Todo();
        newTodo.label = req.body.label
        newTodo.done = false
        user.todos.push(newTodo)
        const results = await getRepository(User).save(user);
        return res.json(results);
    }
    return res.json("todo no funciona");
}

export const getTodo = async (req: Request, res: Response): Promise<Response> => {
    const todo = await getRepository(Todo).find({ relations: ["user"] });
    return res.json(todo);
}

export const getTodos = async (req: Request, res: Response): Promise<Response> => {
    const results = await getRepository(User).findOne({ relations: ["todo"], where: { id: req.params.id } });
    if (!results) throw new Exception("nel")
    return res.json(results.todos);
}

export const updateTodo = async (req: Request, res: Response): Promise<Response> => {
    const todosRepo = getRepository(Todo)
    const todo = await todosRepo.findOne(req.params.id);
    if (!todo) throw new Exception("No funciona");
    todosRepo.merge(todo, req.body);
    const results = await todosRepo.save(todo);
    return res.json(results);
}

