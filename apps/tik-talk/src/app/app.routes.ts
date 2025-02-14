import {Routes} from '@angular/router';
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from '@tt/profile';
import {authGuard, LoginPageComponent} from '@tt/auth';
import {chatsRoutes} from "@tt/chats";
import {LayoutComponent} from "@tt/layout";
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {path: 'chats', loadChildren: () => chatsRoutes},
    ],
    canActivate: [authGuard],
  },
];
