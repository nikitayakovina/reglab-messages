import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthActions, ChannelActions, UserActions } from '../../../store/actions';
import {
  selectActiveChannel, selectActiveChannelUsers,
  selectAllChannels, selectAllUsers,
  selectCurrentUser,
} from '../../../store/selectors';
import {combineLatest, take} from 'rxjs';
import {IChannel} from '../../../models/channel';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private store = inject(Store);
  private router = inject(Router);

  currentUser$ = this.store.select(selectCurrentUser);
  channels$ = this.store.select(selectAllChannels);
  activeChannel$ = this.store.select(selectActiveChannel);
  otherUsers$ = this.store.select(selectActiveChannelUsers);

  showChannelModal = signal(false);
  showUserModal = signal(false);
  newChannelName = '';
  newUsername = '';

  selectChannel(channel: IChannel): void {
    this.store.dispatch(ChannelActions.selectChannel({ channel }));
  }

  submitChannel(): void {
    const name = this.newChannelName.trim();

    if (!name) return;

    this.store.select(selectCurrentUser).pipe(take(1)).subscribe(user => {
      if (user) {
        this.store.dispatch(ChannelActions.addChannel({ name, userId: user.id }));
      }
    });

    this.newChannelName = '';

    this.showChannelModal.set(false);
  }

  submitUser(): void {
    const username = this.newUsername.trim();
    if (!username) return;

    combineLatest([
      this.store.select(selectAllUsers),
      this.store.select(selectActiveChannel),
    ]).pipe(take(1)).subscribe(([users, activeChannel]) => {
      const user = users.find(u => u.username === username);

      if (!user) {
        return;
      }

      if (!activeChannel) {
        return;
      }

      this.store.dispatch(UserActions.addUser({
        user_id: user.id,
        channel_id: activeChannel.id,
      }));
    });

    this.newUsername = '';
    this.showUserModal.set(false);
  }

  goToProfile(): void {
    this.router.navigate(['/user']);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
