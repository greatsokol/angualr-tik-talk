import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {profileActions, ProfileService, selectMe} from "@tt/profile";
import {SubscriberCardComponent} from "../subscriber-card/subscriber-card.component";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    RouterLink,
    AsyncPipe,
    SubscriberCardComponent,
    RouterLinkActive,
    AvatarCircleComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  store = inject(Store);

  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.store.selectSignal(selectMe)


  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit(): void {
    this.store.dispatch(profileActions.getMe());
  }
}
