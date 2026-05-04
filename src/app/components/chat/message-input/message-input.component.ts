import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {take} from 'rxjs';
import {MessageActions} from '../../../store/actions';
import {selectActiveChannel, selectCurrentUser} from '../../../store/selectors';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent {
  content = '';
  private store = inject(Store);

  send(): void {
    const text = this.content.trim();
    if (!text) return;

    let userId: string | undefined;
    let channelId: string | undefined;

    this.store.select(selectCurrentUser).pipe(take(1)).subscribe(u => userId = u?.id);
    this.store.select(selectActiveChannel).pipe(take(1)).subscribe(c => channelId = c?.id);

    if (!userId || !channelId) return;

    this.store.dispatch(MessageActions.sendMessage({
      fromUser: userId,
      channelId,
      content: text,
    }));

    this.content = '';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
