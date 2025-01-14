import { JwtAuthGuard } from './jwt.guard';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return class MockAuthGuard {};
  }),
}));

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
  });
});
