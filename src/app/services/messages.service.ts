import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable} from 'rxjs';
import {IMessage} from '../models/message';
import {API_DELAY} from '../app.config';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  public httpClientService = inject(HttpClient);

  public getMessages(channelId: string): Observable<IMessage[]> {
    return this.httpClientService
      .get<IMessage[]>(`${environment.apiUrl}/messages`, {
        params: { channel_id: channelId }
      })
      .pipe(delay(API_DELAY));
  }

  public sendMessage(payload: Omit<IMessage, 'id' | 'ts'>): Observable<IMessage> {
    const message = {
      ...payload,
      ts: Date.now()
    };

    return this.httpClientService
      .post<IMessage>(`${environment.apiUrl}/messages`, message)
      .pipe(delay(API_DELAY));
  }
}
