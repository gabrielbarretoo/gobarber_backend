import nodemailer, { Transporter } from 'nodemailer'
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk'
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from "../models/IMailProvider";
import mailConfig from '@config/mail';

interface IMessage {
  to: string;
  body: string;
}

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ){
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2021-12-01',
        region: 'us-east-1'
      })
    });
  }
  public async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void>{

    const { name, email } = mailConfig.default.from
    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),

    });
  }

}