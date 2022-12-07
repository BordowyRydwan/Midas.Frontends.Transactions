import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from "../services/cookie/cookies.service";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  isUserLogged = false;

  constructor(
    private cookieService: CookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.cookieService.getCookie("USER_SESSION")
      .subscribe((result) => this.isUserLogged = result !== undefined);

    return this.isUserLogged;
  }
}
