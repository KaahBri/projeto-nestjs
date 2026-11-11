import type { Request, Response } from 'express';
import { LoggerMiddleware } from './logger.middleware.js';
// Mock de requisição: originalUrl e path DIFERENTES de
// propósito, como acontece num middleware global
// (forRoutes('*')), onde req.path chega como '/'.

function criarReq(url: string, role?: string) {
  return {
    method: 'GET',
    originalUrl: url,
    path: '/',
    headers: role ? { 'x-user-role': role } : {},
  } as unknown as Request;
}
function criarRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}
describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  it('deve chamar next() para uma rota comum', () => {
    const next = vi.fn();
    middleware.use(criarReq('/livros/1'), criarRes(), next);
    expect(next).toHaveBeenCalled();
  });
  it('deve logar o método e a URL', () => {
    middleware.use(criarReq('/livros/1'), criarRes(), vi.fn());

    expect(console.log).toHaveBeenCalledWith('[GET] /livros/1');
  });
  it('deve bloquear /admin sem o header com 403', () => {
    const res = criarRes();
    const next = vi.fn();
    middleware.use(criarReq('/admin'), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
  it('deve bloquear /admin com cargo diferente', () => {
    const res = criarRes();
    middleware.use(criarReq('/admin', 'estagiario'), res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it('deve liberar /admin para supervisor', () => {
    const next = vi.fn();
    middleware.use(criarReq('/admin', 'supervisor'), criarRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
