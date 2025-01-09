import { z } from 'zod';
import { DatabaseError } from './utils/errors';

export class ValidationError extends Error {
  constructor(
    public errors: z.ZodError,
    message: string = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validate = <T>(schema: z.Schema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw new DatabaseError('VALIDATION_ERROR', 'Failed to validate data');
  }
};

export const validatePartial = <T>(schema: z.Schema<T>, data: unknown): Partial<T> => {
  try {
    return schema.partial().parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw new DatabaseError('VALIDATION_ERROR', 'Failed to validate data');
  }
};
