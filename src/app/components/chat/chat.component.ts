import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {SidebarComponent} from './sidebar/sidebar.component';
import {MessageListComponent} from './message-list/message-list.component';
import {MessageInputComponent} from './message-input/message-input.component';
import {ChannelActions, UserActions} from '../../store/actions';
import {selectCurrentUser} from '../../store/selectors';
import {take} from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SidebarComponent, MessageListComponent, MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private store = inject(Store);

  ngOnInit(): void {
    this.store.select(selectCurrentUser).pipe(take(1)).subscribe(user => {
      if (!user) return;
      this.store.dispatch(UserActions.loadAllUsers());
      this.store.dispatch(ChannelActions.loadChannels({userId: user.id}));
    });
  }
}
