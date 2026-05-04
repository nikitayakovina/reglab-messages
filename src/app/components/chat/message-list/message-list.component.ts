import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AsyncPipe, DatePipe} from '@angular/common';
import {selectActiveChannel, selectMessageGroups, selectMessagesLoading} from '../../../store/selectors';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent {
  private store = inject(Store);

  activeChannel$ = this.store.select(selectActiveChannel);
  groups$ = this.store.select(selectMessageGroups);
  loading$ = this.store.select(selectMessagesLoading);

  formatTime(ts: number): string {
    const d = new Date(ts);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
