import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization as string;

    if (!auth) {
      throw new UnauthorizedException('Token não informado');
    }

    const token = auth.replace('Bearer ', '').trim();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      (req as any).user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
