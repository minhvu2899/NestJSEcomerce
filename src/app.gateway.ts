import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private users = [];
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload, client.id);
  }
  @SubscribeMessage('onUserSelected')
  handleonUserSelected(client: Socket, user: any): void {
    console.log('UserSelected', user);
    const admin = this.users.find((x) => x.isAdmin && x.online);
    console.log('admin', admin);
    if (admin) {
      const existUser = this.users.find((x) => x.id === user.id);
      this.server.to(admin.socketId).emit('selectUser', existUser);
    }
  }
  @SubscribeMessage('onNewOrder')
  handleonNewOrder(client: Socket, data: any): void {
    console.log('UserSelected', data);
    const admin = this.users.find((x) => x.isAdmin && x.online);
    console.log('admin', admin);

    if (admin) {
      this.server.to(admin.socketId).emit('newOrder', data);
    }
  }
  @SubscribeMessage('onMessage')
  handleonMessage(client: Socket, message: any): void {
    console.log('message', message);
    if (message.isAdmin) {
      const user = this.users.find((x) => x.id === message.id && x.online);
      if (user) {
        message.date = new Date();
        this.server.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = this.users.find((x) => x.isAdmin && x.online);
      console.log(admin);
      if (admin) {
        message.date = new Date();
        this.server.to(admin.socketId).emit('message', message);
        const user = this.users.find((x) => x.id === message.id && x.online);
        user.messages.push(message);
        console.log(message);
      } else {
        this.server.to(client.id).emit('message', {
          name: 'Admin',
          body: 'Xin lỗi, tôi hiện không online bây giờ',
          date: new Date(),
        });
      }
    }
  }
  @SubscribeMessage('onLogin')
  handleLogin(client: Socket, user: any): void {
    console.log('userLogin', user);
    const updatedUser = {
      ...user,
      online: true,
      socketId: client.id,
      messages: [],
    };
    const existUser = this.users.find((x) => x.id === updatedUser.id);
    if (existUser) {
      existUser.socketId = client.id;
      existUser.online = true;
    } else {
      this.users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = this.users.find((x) => x.isAdmin && x.online);
    if (admin) {
      this.server.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      this.server.to(updatedUser.socketId).emit('listUsers', this.users);
    }
  }
  afterInit(server: Server) {
    console.log('Init');
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = this.users.find((x) => x.socketId === client.id);
    if (user) {
      user.online = false;
      console.log('Offline', user.name);
      const admin = this.users.find((x) => x.isAdmin && x.online);
      if (admin) {
        this.server.to(admin.socketId).emit('updateUser', user);
      }
    }
  }
}
