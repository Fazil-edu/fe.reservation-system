import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens';
import { HttpClient } from '@angular/common/http';
import { toHttpQueryParams } from '../util';
import { Observable } from 'rxjs';

export type CrudQueryParams = string | { [params: string]: unknown };

export interface CrudAPI<T = any> {
  createOne: (data: Partial<T>) => Observable<T | null>;
  readMany: (params?: CrudQueryParams) => Observable<T[]>;
  readOne: (
    id: string | number,
    params?: CrudQueryParams
  ) => Observable<T | null>;
  updateOne: (id: string | number, data: Partial<T>) => Observable<Partial<T>>;
  deleteOne: (id: string | number) => Observable<null>;
}

@Injectable({ providedIn: 'root' })
export class CrudService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiBase: string
  ) {}

  forEndpoint<T = any>(endpoint: string): CrudAPI<T> {
    return {
      createOne: (data: Partial<T>) => this.createOne<T>(endpoint, data),
      readMany: (params?: CrudQueryParams) =>
        this.readMany<T>(endpoint, params),
      readOne: (id: string | number, params?: CrudQueryParams) =>
        this.readOne<T>(endpoint, id, params),
      updateOne: (id: string | number, data: Partial<T>) =>
        this.updateOne<T>(endpoint, id, data),
      deleteOne: (id: string | number) => this.deleteOne(endpoint, id),
    };
  }

  createOne<T = any>(endpoint: string, data: Partial<T>) {
    return this.http.post<T | null>(`${this.apiBase}/${endpoint}`, data);
  }

  readMany<T = any>(endpoint: string, params?: CrudQueryParams) {
    return this.http.get<T[]>(
      `${this.apiBase}/${endpoint}${toHttpQueryParams(params)}`
    );
  }

  readOne<T = any>(
    endpoint: string,
    id: string | number,
    params?: CrudQueryParams
  ) {
    return this.http.get<T | null>(
      `${this.apiBase}/${endpoint}/${id}${toHttpQueryParams(params)}`
    );
  }

  updateOne<T = any>(endpoint: string, id: string | number, data: Partial<T>) {
    return this.http.put<Partial<T>>(`${this.apiBase}/${endpoint}/${id}`, data);
  }

  deleteOne(endpoint: string, id: string | number) {
    return this.http.delete<null>(`${this.apiBase}/${endpoint}/${id}`);
  }
}
