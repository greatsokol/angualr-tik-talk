import {inject, Injectable} from "@angular/core";
import {ProfileService} from "../services/profile.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {profileActions} from "./actions";
import {map, switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
  }
)
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filterProfiles = createEffect(
    () => this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({filters}) =>
        this.profileService.filterProfiles(filters)),
      map(response => profileActions.profilesLoaded({profiles: response.items}))
    )
  );

  getMe = createEffect(
    () => this.actions$.pipe(
      ofType(profileActions.getMe),
      switchMap(() => this.profileService.getMe()),
      map(response => profileActions.meLoaded({me: response}))
    )
  );

  // switchMap(
  //   response => of(
  //     profileActions.meLoaded({me: response}),
  //     //profileActions.avatarUrlLoaded({avatarUrl: response.avatarUrl})
  //   )
  // )
}
