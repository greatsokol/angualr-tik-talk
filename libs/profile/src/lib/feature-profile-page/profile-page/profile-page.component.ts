import {Component, inject, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../ui';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {PostFeedComponent} from '@tt/posts';
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "../../data";

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
    this.router.navigate(['/chats', 'new'], {queryParams: {userId: profileId}});
  }
}
