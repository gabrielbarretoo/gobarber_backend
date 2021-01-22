import 'reflect-metadata';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '@modules/Users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UptadeUserAvatar', () => {

  beforeEach(() =>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
  })

  it('should be able to update the profile', async () => {


    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tr',
      email: 'johndo222e@example.com',
    })

    expect(updateUser.name).toBe('John Tr');
    expect(updateUser.email).toBe('johndo222e@example.com');

  });

  it('should not be able to update the profile with another user email', async () => {


    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await fakeUsersRepository.create({
      name: 'John Doe2',
      email: 'johndoe2@example.com',
      password: '123456'
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Tr',
      email: 'johndoe2@example.com',
    })).rejects.toBeInstanceOf(AppError)

  });

  it('should be able to update the password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tr',
      email: 'johndo222e@example.com',
      old_password: '123456',
      password: '123123'
    });

    expect(updateUser.password).toBe('123123');

  });

  it('should not be able to update password without old password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Tr',
      email: 'johndo222e@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)

  });

  it('should not be able to update password with wrong old password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Tr',
      email: 'johndo222e@example.com',
      old_password: 'wrong-old-password',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)

  });

  it('should not be able to update the profile from non-existing user', async () => {

    expect(updateProfile.execute({
      user_id: 'non-existing-user',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);

  });
})
