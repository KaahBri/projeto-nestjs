import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(
    z.object({
      idade: z.number().min(18, 'menor de idade'),
    }),
  );
  it('deve devolver o dado quando é válido', () => {
    expect(pipe.transform({ idade: 20 })).toEqual({
      idade: 20,
    });
  });
  it('deve lançar BadRequestException com campo e mensagem', () => {
    try {
      pipe.transform({ idade: 17 });
      throw new Error('deveria ter lançado');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect((e as BadRequestException).getResponse()).toMatchObject({
        message: [
          {
            campo: 'idade',
            mensagem: 'menor de idade',
          },
        ],
      });
    }
  });
  it('deve rejeitar campo ausente', () => {
    expect(() => pipe.transform({})).toThrow(BadRequestException);
  });
});
