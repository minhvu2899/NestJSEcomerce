import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: async (config: ConfigService) => {
    return v2.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
