import {Component, inject, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {firstValueFrom, switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {PostFeedComponent} from '@tt/posts';
import {ChatsService} from '../../data/services/chats.service';
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/profile";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    RouterLink,
    SvgIconComponent,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService: ProfileService = inject(ProfileService);
  chatsService: ChatsService = inject(ChatsService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  subscribers$ = this.profileService.getSubscribersShortList(5);
  me = this.profileService.me;
  me$ = toObservable(this.me);
  isMyPage = signal<boolean>(false);

  profile$ = this.route.params.pipe(
    switchMap(({id}) => {
      this.isMyPage.set(id === 'me' || id === this.me()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  sendMessage(profileId: number) {
    firstValueFrom(this.chatsService.createChat(profileId)).then((chat) => {
      this.router.navigate(['/chats', chat.id]);
    });
  }
}
