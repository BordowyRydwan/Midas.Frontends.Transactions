import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;


@Injectable({
  providedIn: 'root'
})
export class CookieService {
  public getCookies(): Observable<object | null> {
    const entries = document.cookie
      .split(';')
      .map((x) => x.trim().split('='));

    return of(Object.fromEntries(entries));
  }

  public getCookie(prop: string): Observable<string | null> {
    return this.getCookies()
      .pipe(map(result => {
          if(result === null){
            return null;
          }

          return (result as any)[prop] as string;
        }
      ));
  }

  public setCookie(prop: string, value: any, daysExpiring = 1): void {
    const date = new Date();

    date.setTime(date.getTime() + (daysExpiring * MILLISECONDS_IN_DAY));
    document.cookie = `${prop}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  public deleteCookie(prop: string): void {
    document.cookie = `${prop}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
