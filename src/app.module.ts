import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
// import { PermissionGuard } from './permission/permission.guard';
import { CategorysModule } from './categories/categorys.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { CommonController } from './common/common.controller';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { CommentsModule } from './comments/comments.module';
import { BrandsModule } from './brands/brands.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrderTrackModule } from './order-track/order-track.module';
import { FeeshipModule } from './feeship/feeship.module';
import { CouponModule } from './coupon/coupon.module';
import { StatisticsModule } from './statistics/statistics.module';
import { GhtkModule } from './ghtk/ghtk.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AppGateway } from './app.gateway';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
    // MulterModule.register({
    //   dest: './upload',
    // }),

    AuthModule,
    UsersModule,
    RolesModule,
    PermissionModule,
    ProductsModule,
    CategorysModule,
    OrdersModule,
    CartModule,
    UploadModule,
    CommentsModule,
    BrandsModule,
    AddressesModule,
    OrderTrackModule,
    FeeshipModule,
    CouponModule,
    StatisticsModule,
    GhtkModule,
    CloudinaryModule,
    WishlistModule,
    ReplyModule,
  ],
  controllers: [CommonController, UploadController],
  providers: [AppGateway],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: PermissionGuard,
  //   },
  // ],
})
export class AppModule {}
