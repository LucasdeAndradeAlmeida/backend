import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from './user.entity';

// 1. Defina interface customizada para o request
interface AuthenticatedRequest extends Request {
  user?: User; // Substitua "any" pelo tipo exato do payload do seu JWT, se souber
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // 2. Valide a existência do segredo na inicialização (boa prática)
  private readonly jwtSecret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não definido nas variáveis de ambiente!');
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não informado');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // 3. Validação e atribuição tipada do payload
      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded as User;
      return true;
    } catch (err) {
      // 4. Log apenas para auditoria interna, não exponha detalhes ao usuário
      console.error('Erro de autenticação JWT:', err);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
