import 'reflect-metadata';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {

    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

  })

  it('should be able to authenticate', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456'

    })

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);

  });
  it('should not be able to authenticate with non existing user', async () => {

    expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456'

    })).rejects.toBeInstanceOf(AppError);

  });
  it('should not be able to authenticate with wrong password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: 'aaaaaaa'
    })).rejects.toBeInstanceOf(AppError);

  });

})
