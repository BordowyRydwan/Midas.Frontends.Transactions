import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, from as _observableFrom, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

/*export class FileParameter implements IFileParameter {
  data?: any;
  fileName?: string;

  constructor(data?: IFileParameter) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.data = _data["data"];
      (<any>this).fileName = _data["fileName"];
    }
  }

  static fromJS(data: any): FileParameter {
    data = typeof data === 'object' ? data : {};
    let result = new FileParameter();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data["data"] = this.data ? this.data.toJSON() : <any>undefined;
    data["fileName"] = this.fileName;
    return data;
  }
}

export interface IFileParameter {
  data?: any;
  fileName?: string;
}*/

export default class BaseApiService {
  protected transformOptions(options: any): Promise<any> {
    const session_token = document.cookie
      .split(';')
      .map((x) => x.trim().split('='))
      .find(x => x[0] == 'USER_SESSION');

    if(session_token !== null && session_token !== undefined) {
      options.headers = options.headers.append('Authorization', session_token[1]);
    }

    return Promise.resolve(options);
  }
}
