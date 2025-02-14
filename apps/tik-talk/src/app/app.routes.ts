import {Routes} from '@angular/router';
import {ProfilePageComponent, SearchPageComponent, SettingsPageComponent} from '@tt/profile';
import {authGuard, LoginPageComponent} from '@tt/auth';
import {chatsRoutes} from "@tt/chats";
import {LayoutComponent} from "@tt/layout";

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'profile/:id', component: ProfilePageComponent},
      {path: 'settings', component: SettingsPageComponent},
      {path: 'search', component: SearchPageComponent},
      {path: 'chats', loadChildren: () => chatsRoutes},
    ],
    canActivate: [authGuard],
  },
];
