import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { IdentityService } from "../services/identity.service";
import { MenuService } from "../services/menu.service";


// export const AuthGuard: CanActivateFn = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
// ):
//     Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree => {
//     return inject(IdentityService).isAuthenticate()
//         ? true
//         : inject(Router).createUrlTree(['/login']);
// };

export const AuthGuard: CanActivateFn = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> => {
  
    const identityService = inject(IdentityService);
    const menuService = inject(MenuService);
    const router = inject(Router);
  
    if (!identityService.isAuthenticate()) {
      return router.createUrlTree(['/login']);
    }
  
    // Check cache
    let menus = menuService.getMenusFromCache();
  
    // ⏳ If menus not loaded, fetch from API
    if (!menus || menus.length === 0) {
      try {
        const response = await menuService.getMenuList().toPromise();
        menus = response?.data || [];
        menuService.setMenusToCache(menus);
      } catch (err) {
        console.error('Menu API failed', err);
        return router.createUrlTree(['/dashboard']);
      }
    }
  
    const currentPath = state.url.split('?')[0].toLowerCase();
  
    const matchedMenu = menus.find(menu => {
      const menuUrl = menu.navigationUrl.replace('./', '/').toLowerCase();
      return currentPath.startsWith(menuUrl);
    });
  
    if (matchedMenu?.canView) {
      return true;
    }
  
    return router.createUrlTree(['/dashboard']);
  };