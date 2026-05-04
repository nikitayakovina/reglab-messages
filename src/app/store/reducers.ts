import { createReducer, on } from '@ngrx/store';
import {IUser} from '../models/user';
import {IMessage} from '../models/message';
import {IChannel} from '../models/channel';
import { AuthActions, ChannelActions, MessageActions, UserActions } from './actions';

export interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const authInitial: AuthState = { user: null, loading: false, error: null };

export const authReducer = createReducer(
  authInitial,
  on(AuthActions.login, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(AuthActions.logout, () => authInitial),
);

export interface ChannelState {
  channels: IChannel[];
  activeChannel: IChannel | null;
  loading: boolean;
  error: string | null;
}

const channelInitial: ChannelState = { channels: [], activeChannel: null, loading: false, error: null };

export const channelReducer = createReducer(
  channelInitial,
  on(ChannelActions.loadChannels, state => ({ ...state, loading: true, error: null })),
  on(ChannelActions.loadChannelsSuccess, (state, { channels }) => ({
    ...state,
    channels,
    activeChannel: channels[0] ?? null,
    loading: false,
  })),
  on(ChannelActions.loadChannelsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(ChannelActions.selectChannel, (state, { channel }) => ({ ...state, activeChannel: channel })),
  on(ChannelActions.addChannelSuccess, (state, { channel }) => ({
    ...state,
    channels: [...state.channels, channel],
    activeChannel: channel,
  })),
  on(AuthActions.logout, () => channelInitial),
);

export interface UserState {
  allUsers: IUser[];
  channelUsers: Record<string, IUser[]>;
  loading: boolean;
  error: string | null;
}

const userInitial: UserState = {
  allUsers: [],
  channelUsers: {},
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  userInitial,
  on(UserActions.loadAllUsers, state => ({ ...state, loading: true })),
  on(UserActions.loadAllUsersSuccess, (state, { allUsers }) => ({ ...state, allUsers, loading: false })),
  on(UserActions.loadAllUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.loadChannelUsersSuccess, (state, { channelId, users }) => ({
    ...state,
    channelUsers: { ...state.channelUsers, [channelId]: users },
  })),
  on(UserActions.addUserSuccess, (state, { user, channel_id }) => ({
    ...state,
    channelUsers: {
      ...state.channelUsers,
      [channel_id]: [
        ...(state.channelUsers[channel_id] ?? []).filter(u => u.id !== user.id),
        user,
      ],
    },
  })),
  on(AuthActions.logout, () => userInitial),
);

export interface MessageState {
  messages: IMessage[];
  loading: boolean;
  error: string | null;
}

const messageInitial: MessageState = { messages: [], loading: false, error: null };

export const messageReducer = createReducer(
  messageInitial,
  on(MessageActions.loadMessages, state => ({ ...state, loading: true, error: null })),
  on(MessageActions.loadMessagesSuccess, (state, { messages }) => ({ ...state, messages, loading: false })),
  on(MessageActions.loadMessagesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(MessageActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
  })),
  on(ChannelActions.selectChannel, state => ({ ...state, messages: [] })),
  on(AuthActions.logout, () => messageInitial),
);
