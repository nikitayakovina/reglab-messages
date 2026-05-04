import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AsyncPipe, UpperCasePipe} from '@angular/common';
import {AuthActions} from '../../store/actions';
import {selectCurrentUser} from '../../store/selectors';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  private store = inject(Store);
  currentUser$ = this.store.select(selectCurrentUser);
  private router = inject(Router);

  goBack(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getInitial(username: string): string {
    return username.charAt(0).toUpperCase();
  }
}
