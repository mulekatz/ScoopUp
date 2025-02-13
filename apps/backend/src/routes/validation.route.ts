import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationController } from '@/controllers/validation.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { ValidateImageDto } from '@/dtos/validation.dto';

export class ValidationRoute implements Routes {
  public router = Router();
  public validation = new ValidationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/api/validateImages`, ValidationMiddleware(ValidateImageDto), this.validation.validateImages);
  }
}
