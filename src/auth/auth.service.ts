import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Verifique o email que está sendo procurado
    console.log('Tentativa de registro com Email:', dto.email);

    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    // 2. Verifique o resultado da busca
    console.log('Resultado da busca (existing):', existing);

    if (existing) {
      // 3. Este log indica que a busca retornou algo (problema de consulta)
      console.log('🚨 CONFLITO: Usuário encontrado. ID:', existing.id);
      throw new ConflictException('Email já está em uso');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
    });

    await this.userRepo.save(user);

    return { message: 'Usuário criado com sucesso' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Credenciais inválidas');

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1d',
    });

    return { token };
  }
}
