import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MenuService } from "../services/menu.service";
import { CommonService } from "../services/common.service";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const menuService = inject(MenuService);
  const router = inject(Router);
  const commonService = inject(CommonService);

  return menuService.getMenuList().pipe(
    map((response: any) => {
      const menus = response?.data || [];
      const requestedUrl = state.url;

      const matchedMenu = menus.find((menu: any) =>
        requestedUrl.includes(menu.navigationUrl.replace('./', ''))
      );

      if (matchedMenu) {
        commonService.activemenuRoleList.next(matchedMenu);
        return true;
      } else {
        return router.createUrlTree(['/dashboard']);
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/dashboard']));
    })
  );
};
