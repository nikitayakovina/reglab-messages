import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {firstValueFrom} from 'rxjs';
import {authGuard, guestGuard} from './auth.guard';
import {selectIsLoggedIn} from '../store/selectors';

const runGuard = (guardFn: any) =>
  TestBed.runInInjectionContext(() => guardFn(null as any, null as any));

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: {auth: {user: null}}}),
        {provide: Router, useValue: {navigate: jest.fn(), createUrlTree: (c: any[]) => c}},
      ],
    });
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('allows access when user is logged in', async () => {
    store.overrideSelector(selectIsLoggedIn, true);
    store.refreshState();
    const result = await firstValueFrom(runGuard(authGuard) as any);
    expect(result).toBe(true);
  });

  it('redirects to /login when not logged in', async () => {
    store.overrideSelector(selectIsLoggedIn, false);
    store.refreshState();
    const result = await firstValueFrom(runGuard(authGuard) as any);
    expect(result).toEqual(['/login']);
  });
});

describe('guestGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: {auth: {user: null}}}),
        {provide: Router, useValue: {navigate: jest.fn(), createUrlTree: (c: any[]) => c}},
      ],
    });
    store = TestBed.inject(MockStore);
  });

  it('allows access when not logged in', async () => {
    store.overrideSelector(selectIsLoggedIn, false);
    store.refreshState();
    const result = await firstValueFrom(runGuard(guestGuard) as any);
    expect(result).toBe(true);
  });

  it('redirects to / when already logged in', async () => {
    store.overrideSelector(selectIsLoggedIn, true);
    store.refreshState();
    const result = await firstValueFrom(runGuard(guestGuard) as any);
    expect(result).toEqual(['/']);
  });
});
