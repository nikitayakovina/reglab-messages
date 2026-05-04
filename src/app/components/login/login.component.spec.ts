import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';
import { AuthActions } from '../../store/actions';
import { selectAuthError, selectAuthLoading } from '../../store/selectors';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideMockStore({
          initialState: { auth: { user: null, loading: false, error: null } },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('username required', () => {
    component.submit();
    expect(component.usernameCtrl.touched).toBe(true);
    expect(component.getUsernameError()).toBe('Username is required');
  });

  it('password required', () => {
    component.submit();
    expect(component.passwordCtrl.touched).toBe(true);
    expect(component.getPasswordError()).toBe('Password is required');
  });

  it('minlength error', () => {
    component.usernameCtrl.setValue('a');
    component.usernameCtrl.markAsTouched();
    expect(component.getUsernameError()).toBe('Minimum 2 characters');
  });

  it('login action with valid data', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.form.setValue({ username: 'anton', password: 'anton123' });
    component.submit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({ username: 'anton', password: 'anton123' }),
    );
  });

  it('not dispatch form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.submit();

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: '[Auth] Login' }),
    );
  });

  it('error message store', () => {
    store.overrideSelector(selectAuthError, 'Invalid username or password');
    store.overrideSelector(selectAuthLoading, false);
    store.refreshState();
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.auth-error');
    expect(el?.textContent).toContain('Invalid username or password');
  });
});
