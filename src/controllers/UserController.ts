import { Request, Response } from 'express';
import { BadRequestError } from '../helpers/api-errors';
import { userRepository } from '../repositories/userRepository';
import {sign} from 'jsonwebtoken';
import {hash,compare} from 'bcrypt'
require("dotenv").config();


export class UserController {
	async create(req: Request, res: Response) {
		const { name, email, password } = req.body;

		const userExists = await userRepository.findOneBy({ email });

		if (userExists) {
			throw new BadRequestError('E-mail já existe');
		}

		const hashPassword = await hash(password, 10);
		console.log(hashPassword);

		const newUser = userRepository.create({
			name,
			email,
			password: hashPassword,
		})

		await userRepository.save(newUser);

		const { password: _, ...user } = newUser;

		return res.status(201).json(user);
	}

	async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const user = await userRepository.findOneBy({ email });

		if (!user) {
			throw new BadRequestError('E-mail ou senha inválidos');
		}

		const verifyPass = await compare(password, user.password);

		if (!verifyPass) {
			throw new BadRequestError('E-mail ou senha inválidos');
		}

		const token = sign({ id: user.id }, process.env.JWT_PASS ?? '', {
			expiresIn: '8h',
		})

		console.log(token);

		const { password: _, ...userLogin } = user;

		return res.json({
			user: userLogin,
			token: token,
		})
	}

	async getProfile(req: Request, res: Response) {
		return res.json(req.user);
	}
}