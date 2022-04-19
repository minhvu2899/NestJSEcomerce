// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { RolesService } from '../roles/roles.service';
// import { User } from '../users/user.entity';
// import { Role } from '../roles/role.entity';
// import { UsersService } from './../users/users.service';

// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(
//     private relfector: Reflector,
//     private usersService: UsersService,
//     private roleService: RolesService,
//   ) {}

//   async canActivate(context: ExecutionContext) {
//     const access = this.relfector.get<string>('access', context.getHandler());
//     console.log('asdasdasdasdasd', access);
//     if (!access) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();

//     // const id = request.user.id;

//     // const user: User = await this.usersService.findOne({ id }, ['roles']);
//     console.log(request.user);

//     // const role: Role = await this.roleService.findOne({ id: user.role.id }, [
//     //   'permissions',
//     // ]);
//     // console.log(role);
//     // if (request.method === 'GET') {
//     //   return role.permissions.some(
//     //     (p) => p.name === `view_${access}` || p.name === `edit_${access}`,
//     //   );
//     // }

//     // return role.permissions.some((p) => p.name === `edit_${access}`);

//     return true;
//   }
// }
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/roles/role.entity';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private roleService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);

    const role: Role = await this.roleService.findOne({ id: user.role.id }, [
      'permissions',
    ]);
    console.log(role);
    if (request.method === 'GET') {
      return role.permissions.some(
        (p) => p.name === `view_${roles}` || p.name === `edit_${roles}`,
      );
    }

    return role.permissions.some((p) => p.name === `edit_${roles}`);
  }
}
