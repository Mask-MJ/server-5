import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/modules/iam/iam.constants';
import { PrismaService } from 'nestjs-prisma';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const contextPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!contextPermissions) return true;
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: {
        role: {
          include: {
            menu: {
              where: { status: true, type: 'B' }, // 只查询按钮类型的菜单
            },
          },
        },
      },
    });

    if (!userInfo) return false;
    if (userInfo.isAdmin) return true;

    const permissionsName = userInfo.role
      .flatMap((role) => role.menu)
      .map((menu) => menu.permission)
      .filter((permission) => permission !== null);
    return contextPermissions.every((permission) =>
      permissionsName.includes(permission),
    );
  }
}
