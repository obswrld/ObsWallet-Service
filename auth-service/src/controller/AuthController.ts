import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { RegisterSchema, LoginSchema } from '../dto/auth.dto';
import { UserRepository } from '../repository/UserRepository';

const authService = new AuthService(new UserRepository());

export class AuthController {

  async register(req: Request, res: Response) {
    const result = RegisterSchema.safeParse(req.body);

    if(!result.success) {
      return res.status(400).json({ errors: result.error.issues});
    }

    try {
      const user = await authService.register(result.data);
      return res.status(201).json(user);
    } catch (error) {
      console.log(error)
      if(error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async login(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);

    if(!result.success) {
      return res.status(400).json({ errors: result.error.issues});
    }

    try {
      const user = await authService.login(result.data);
      return res.status(200).json(user);
    } catch (error) {
      console.log(error)
      if(error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}