import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {AuthActions} from '../../store/actions';
import {selectAuthError, selectAuthLoading} from '../../store/selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });
  private store = inject(Store);
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  get usernameCtrl() {
    return this.form.controls.username;
  }

  get passwordCtrl() {
    return this.form.controls.password;
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loginFailure({error: ''}));
  }

  getUsernameError(): string {
    if (this.usernameCtrl.hasError('required')) return 'Username is required';
    if (this.usernameCtrl.hasError('minlength')) return 'Minimum 2 characters';
    return '';
  }

  getPasswordError(): string {
    if (this.passwordCtrl.hasError('required')) return 'Password is required';
    if (this.passwordCtrl.hasError('minlength')) return 'Minimum 4 characters';
    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const {username, password} = this.form.getRawValue();
    this.store.dispatch(AuthActions.login({username, password}));
  }
}
