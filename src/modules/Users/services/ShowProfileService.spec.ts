import 'reflect-metadata';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {

  beforeEach(() =>{
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to show the profile', async () => {


    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const showUser = await showProfile.execute({ user_id: user.id })

    expect(showUser.name).toBe('John Doe');
    expect(showUser.email).toBe('johndoe@example.com');

  });

  it('should not be able to show the profile from non-existing user', async () => {

    expect(showProfile.execute({
      user_id: 'non-existing-user'
    })).rejects.toBeInstanceOf(AppError);

  });

})
