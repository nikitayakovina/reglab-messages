import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, from, map, mergeMap, of, switchMap, tap} from 'rxjs';
import { AuthActions, ChannelActions, MessageActions, UserActions } from './actions';
import {UserService} from '../services/user.service';
import {ChannelService} from '../services/channel.service';
import {MessagesService} from '../services/messages.service';
import {IUser} from '../models/user';
import {IUserChannel} from '../models/channel';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.userService.login(username, password).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError(err => of(AuthActions.loginFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}

@Injectable()
export class ChannelEffects {
  private actions$ = inject(Actions);
  private channelService = inject(ChannelService);

  loadChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.loadChannels),
      switchMap(({ userId }) =>
        this.channelService.getChannels(userId).pipe(
          map(channels => ChannelActions.loadChannelsSuccess({ channels })),
          catchError(err => of(ChannelActions.loadChannelsFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  loadMessagesOnSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.selectChannel, ChannelActions.loadChannelsSuccess),
      map(action => {
        const channelId =
          'channel' in action ? action.channel.id : action.channels[0]?.id;
        return channelId
          ? MessageActions.loadMessages({ channelId })
          : { type: 'NO_OP' };
      }),
    ),
  );

  addChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.addChannel),
      switchMap(({ name, userId }) =>
        this.channelService.addChannel(name, userId).pipe(
          map(channel => ChannelActions.addChannelSuccess({ channel })),
          catchError(err => of(ChannelActions.addChannelFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  selectChannelAfterAdd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.addChannelSuccess),
      map(({ channel }) =>
        ChannelActions.selectChannel({ channel }),
      ),
    ),
  );
}

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  loadAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadAllUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((allUsers: IUser[]) => UserActions.loadAllUsersSuccess({ allUsers })),
          catchError(err => of(UserActions.loadAllUsersFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  loadChannelUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadChannelUsers),
      mergeMap(({ channelId }) =>
        this.userService.getUserChannels(channelId).pipe(
          switchMap((userChannels: IUserChannel[]) => {
            const userIds = userChannels.map(uc => uc.user_id);
            return this.userService.getUserByIds(userIds).pipe(
              map((users: IUser[]) =>
                UserActions.loadChannelUsersSuccess({ channelId, users }),
              ),
            );
          }),
          catchError(err => of(UserActions.loadChannelUsersFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  loadChannelUsersOnChannelsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.loadChannelsSuccess),
      mergeMap(({ channels }) =>
        from(channels.map(channel =>
          UserActions.loadChannelUsers({ channelId: channel.id })
        )),
      ),
    ),
  );

  loadChannelUsersOnSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChannelActions.selectChannel),
      map(({ channel }) => UserActions.loadChannelUsers({ channelId: channel.id })),
    ),
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      switchMap(({ user_id, channel_id }) =>
        this.userService.addUser(user_id, channel_id).pipe(
          map((user: IUser) => UserActions.addUserSuccess({ user, channel_id })),
          catchError(err => of(UserActions.addUserFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}

@Injectable()
export class MessageEffects {
  private actions$ = inject(Actions);
  private messagesService = inject(MessagesService);

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.loadMessages),
      switchMap(({ channelId }) =>
        this.messagesService.getMessages(channelId).pipe(
          map(messages => MessageActions.loadMessagesSuccess({ messages })),
          catchError(err => of(MessageActions.loadMessagesFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.sendMessage),
      switchMap(({ fromUser, channelId, content }) =>
        this.messagesService.sendMessage({ from_user: fromUser, channel_id: channelId, content }).pipe(
          map(message => MessageActions.sendMessageSuccess({ message })),
          catchError(err => of(MessageActions.sendMessageFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}
