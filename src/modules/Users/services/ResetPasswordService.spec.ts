import 'reflect-metadata';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;


describe('ResetPassword', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider
    );
  })

  it('should be able to reset the password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');

  });
  it('should not be able to reset the password with non-existing token', async () => {

    await expect(resetPassword.execute({
      password: '123123',
      token: 'non-existing-token',
    })).rejects.toBeInstanceOf(AppError)

  });
  it('should not be able to reset the password with non-existing user', async () => {

    const { token } = await fakeUserTokenRepository.generate('non-existing-user')

    await expect(resetPassword.execute({
      password: '123123',
      token,
    })).rejects.toBeInstanceOf(AppError)

  });
  it('should not be able to reset the password if passed more than 2 hours', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3)
    });

    await expect(resetPassword.execute({
      password: '123123',
      token,
    })).rejects.toBeInstanceOf(AppError)

  });


})
