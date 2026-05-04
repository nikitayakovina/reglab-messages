import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, ChannelState, MessageState, UserState } from './reducers';
import { IMessageGroup } from '../models/message';

const selectAuth = createFeatureSelector<AuthState>('auth');
const selectChannels = createFeatureSelector<ChannelState>('channels');
const selectUsers = createFeatureSelector<UserState>('users');
const selectMessages = createFeatureSelector<MessageState>('messages');

export const selectCurrentUser = createSelector(selectAuth, s => s.user);
export const selectAuthLoading = createSelector(selectAuth, s => s.loading);
export const selectAuthError = createSelector(selectAuth, s => s.error);
export const selectIsLoggedIn = createSelector(selectAuth, s => !!s.user);

export const selectAllChannels = createSelector(selectChannels, s => s.channels);
export const selectActiveChannel = createSelector(selectChannels, s => s.activeChannel);
export const selectChannelsLoading = createSelector(selectChannels, s => s.loading);
export const selectAllUsers = createSelector(selectUsers, s => s.allUsers);

export const selectActiveChannelUsers = createSelector(
  selectUsers,
  selectActiveChannel,
  selectCurrentUser,
  (state, activeChannel, me) => {
    if (!activeChannel) return [];
    const users = state.channelUsers[activeChannel.id] ?? [];
    return users.filter(u => u.id !== me?.id);
  },
);

export const selectUserMap = createSelector(
  selectAllUsers,
  users => new Map(users.map(u => [u.id, u])),
);

export const selectAllMessages = createSelector(selectMessages, s => s.messages);
export const selectMessagesLoading = createSelector(selectMessages, s => s.loading);
export const selectMessageGroups = createSelector(
  selectAllMessages,
  selectUserMap,
  selectCurrentUser,
  (messages, userMap, me): IMessageGroup[] => {
    const groups: IMessageGroup[] = [];
    for (const msg of messages) {
      const last = groups[groups.length - 1];
      if (last && last.from_user === msg.from_user && msg.ts - last.ts < 120_000) {
        last.lines.push(msg.content);
        last.ts = msg.ts;
      } else {
        groups.push({
          from_user: msg.from_user,
          username: userMap.get(msg.from_user)?.username ?? 'Unknown',
          lines: [msg.content],
          ts: msg.ts,
          isOwn: msg.from_user === me?.id,
        });
      }
    }
    return groups;
  },
);
