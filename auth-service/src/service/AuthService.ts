import bcrypt from "bcrypt";
import { UserRepository } from "../repository/UserRepository";
import { RegisterDto, LoginDto } from "../dto/auth.dto";


export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async register(data: RegisterDto) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            email: data.email,
            password: hashedPassword,
        });

        const { password: _, ...safeUser } = user;

        return safeUser;  
    }

    async login(data: LoginDto) {
        const user = await this.userRepository.findByEmail(data.email);
        if(!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if(!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const { password: _, ...safeUser } = user;

        return safeUser;
    }
}