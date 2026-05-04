import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {API_DELAY} from '../app.config';
import {environment} from '../environments/environment';
import {IUser} from '../models/user';
import {IUserChannel} from '../models/channel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public httpClientService = inject(HttpClient);

  constructor() {}

  getUsers(): Observable<IUser[]> {
    return this.httpClientService
      .get<IUser[]>(`${environment.apiUrl}/users`)
      .pipe(
        delay(API_DELAY),
      );
  }

  getUserByIds(userIds: string[]): Observable<IUser[]> {
    return this.httpClientService
      .get<IUser[]>(`${environment.apiUrl}/users`, { params: { id: userIds } })
      .pipe(
        delay(API_DELAY),
      );
  }

  getUserChannels(channelId: string): Observable<IUserChannel[]>{
    return this.httpClientService
      .get<IUserChannel[]>(`${environment.apiUrl}/user_channels`, {
        params: { channel_id: channelId }
      })
      .pipe(
        delay(API_DELAY),
      );
  }

  addUser(user_id: string, channel_id: string): Observable<IUser> {
    return this.httpClientService.post<IUserChannel>(
      `${environment.apiUrl}/user_channels`,
      {
        id: crypto.randomUUID(),
        user_id,
        channel_id,
      }
    ).pipe(
      switchMap(userChannel => {
        return this.httpClientService
          .get<IUser[]>(`${environment.apiUrl}/users`, {
            params: { id: userChannel.user_id }
          }).pipe(map(user => user[0] as IUser))
      })
    );
  }

  login(username: string, password: string): Observable<IUser> {
    return this.httpClientService
      .get<IUser[]>(`${environment.apiUrl}/users`, {
        params: { username, password }
      })
      .pipe(
        delay(API_DELAY),
        map((users: IUser[]) => {
          if (!users.length) {
            throw new Error('Invalid username or password');
          }

          const { password, ...user } = users[0];
          return user;
        })
      );
  }
}
