import { CanActivate, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { TextService } from 'src/text/text.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private textService: TextService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    const textId = context.args[1].textId;
    try {
      const decoded = verify(bearerToken, 'test') as any;
      const cond = { email: decoded.email };
      return new Promise((resolve, reject) => {
        return this.userService.findByCond(cond).then(async (user) => {
          if (!user) {
            return reject(false);
          }
          const permission = await this.textService.checkPermission(
            textId,
            user.id,
          );
          if (!permission) {
            return reject(false);
          }
          resolve(user);
        });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
