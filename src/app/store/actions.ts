import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {IUser} from '../models/user';
import {IMessage} from '../models/message';
import {IChannel} from '../models/channel';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ username: string; password: string }>(),
    'Login Success': props<{ user: IUser }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
  },
});

export const ChannelActions = createActionGroup({
  source: 'Channel',
  events: {
    'Load Channels': props<{ userId: string }>(),
    'Load Channels Success': props<{ channels: IChannel[] }>(),
    'Load Channels Failure': props<{ error: string }>(),
    'Select Channel': props<{ channel: IChannel }>(),
    'Add Channel': props<{ name: string; userId: string }>(),
    'Add Channel Success': props<{ channel: IChannel }>(),
    'Add Channel Failure': props<{ error: string }>(),
  },
});

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load All Users': emptyProps(),
    'Load All Users Success': props<{ allUsers: IUser[] }>(),
    'Load All Users Failure': props<{ error: string }>(),
    'Load Channel Users': props<{ channelId: string }>(),
    'Load Channel Users Success': props<{ channelId: string; users: IUser[] }>(),
    'Load Channel Users Failure': props<{ error: string }>(),
    'Add User': props<{ user_id: string; channel_id: string }>(),
    'Add User Success': props<{ user: IUser; channel_id: string }>(),
    'Add User Failure': props<{ error: string }>(),
  },
});

export const MessageActions = createActionGroup({
  source: 'Message',
  events: {
    'Load Messages': props<{ channelId: string }>(),
    'Load Messages Success': props<{ messages: IMessage[] }>(),
    'Load Messages Failure': props<{ error: string }>(),
    'Send Message': props<{ fromUser: string; channelId: string; content: string }>(),
    'Send Message Success': props<{ message: IMessage }>(),
    'Send Message Failure': props<{ error: string }>(),
  },
});
