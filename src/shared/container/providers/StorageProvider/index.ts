import { container } from 'tsyringe';

import IStorageProvider from '../StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '../StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from '../StorageProvider/implementations/S3StorageProvider';

import uploadConfig from '@config/upload';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};


container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);



