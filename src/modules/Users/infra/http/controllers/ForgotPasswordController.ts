import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/Users/services/SendForgotPasswordEmailService';


export default class ForgotPasswordController {
  public async create(request: Request, response: Response ): Promise<Response> {
    const { email, password} = request.body;

    const sendForgotPasswordEmail = container.resolve(SendForgotPasswordEmailService);

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.sendStatus(204).json()
  }
}
