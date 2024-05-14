import { hashPassword, checkPassword} from '../config/crypting';
describe('hashPassword', () => {
  it('should return a consistent hash for the same input', () => {
    process.env.HASH_SECRET = 'secret';  
    const password = 'myPassword';
    const hashed = hashPassword(password);
    expect(hashed).toBe(hashPassword(password));
  });
});



describe('checkPassword', () => {
  it('should return true if passwords match', () => {
    process.env.HASH_SECRET = 'secret';  
    const password = 'testPassword';
    const hashed = hashPassword(password);
    expect(checkPassword(password, hashed)).toBe(true);
  });

  it('should return false if passwords do not match', () => {
    const password = 'testPassword';
    const wrongPassword = 'wrongPassword';
    const hashed = hashPassword(password);
    expect(checkPassword(wrongPassword, hashed)).toBe(false);
  });
});
