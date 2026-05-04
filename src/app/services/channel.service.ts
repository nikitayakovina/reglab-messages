import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable, of, switchMap} from 'rxjs';
import {IChannel} from '../models/channel';
import {map} from 'rxjs/operators';
import {API_DELAY} from '../app.config';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  public httpClientService = inject(HttpClient);

  public getChannels(userId: string): Observable<IChannel[]> {
    return this.httpClientService
      .get<{ user_id: string; channel_id: string }[]>(
        `${environment.apiUrl}/user_channels`,
        {params: {user_id: userId}}
      )
      .pipe(
        map(relations => relations.map(r => r.channel_id)),
        switchMap(ids => {
          if (!ids.length) {
            return of([]);
          }

          const query = ids.map(id => `id=${id}`).join('&');

          return this.httpClientService.get<IChannel[]>(
            `${environment.apiUrl}/channels?${query}`
          );
        }),
        delay(API_DELAY)
      );
  }

  public addChannel(name: string, userId: string): Observable<IChannel> {
    const channelPayload = {
      name: name.toLowerCase().replace(/\s+/g, '-')
    };

    return this.httpClientService
      .post<IChannel>(`${environment.apiUrl}/channels`, channelPayload)
      .pipe(
        switchMap(channel => {
          return this.httpClientService
            .post(`${environment.apiUrl}/user_channels`, {
              user_id: userId,
              channel_id: channel.id
            })
            .pipe(
              map(() => channel)
            );
        }),
        delay(API_DELAY)
      );
  }
}
