import Notification from '../../infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb'

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationRepository {
  private ormRepository: Notification[] = [];

  public async create({ recipient_id, content }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.ormRepository.push(notification);

    return notification;

  };

}

export default NotificationsRepository;
