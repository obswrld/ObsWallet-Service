import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/UserRepository";
import { EmailService } from "./EmailService";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

export class AuthService {
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor(userRepository: UserRepository, emailService: EmailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
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

        const verrificationToken = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        const verificationLink = `http://localhost:${process.env.PORT}/auth/verify?token=${verrificationToken}`;
        await this.emailService.sendVerificationEmail(user.email, verificationLink);

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

      const token = jwt.sign(
        { id: safeUser.id, email: safeUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      )

      return { ...safeUser, token };
      
    }

    async verifyEmail(token: string) {
      let decoded: { email: string };
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };        
      } catch (error) {
        throw new Error("Invalid or expired verification link");
      }

      const user = await this.userRepository.findByEmail(decoded.email);
      if(!user) {
        throw new Error("User not found");
      }
      if(user.isVerified) {
        throw new Error("Email already verified");
      }

      const verifiedUser = await this.userRepository.markAsVerified(decoded.email);
      const { password: _, ...safeUser } = verifiedUser;

      return safeUser;
      
    }

  
}