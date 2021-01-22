import { Request, Response } from 'express';
import UpdateUserAvatarService from '@modules/Users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe'


export default class UserAvatarController {
  public async update(request: Request, response: Response ): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename
    });

    return response.json(classToClass(user))
  }
}