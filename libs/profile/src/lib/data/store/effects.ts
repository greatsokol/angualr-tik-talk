import {inject, Injectable} from "@angular/core";
import {ProfileService} from "../services/profile.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {profileActions} from "./actions";
import {map, switchMap, withLatestFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectProfileFilters, selectProfilesPageAndSize} from "./selectors";

@Injectable({
    providedIn: 'root'
  }
)
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterProfiles = createEffect(
    () => this.actions$.pipe(
      ofType(
        profileActions.filterEvent,
        profileActions.setPage
      ),
      withLatestFrom(
        this.store.select(selectProfileFilters),
        this.store.select(selectProfilesPageAndSize)
      ),
      switchMap(([_, filters, pageAndSize]) =>
        this.profileService.filterProfiles({
          ...pageAndSize,
          ...filters
        })),
      map(response => profileActions.profilesLoadedEvent({profiles: response.items}))
    )
  );

  getMe = createEffect(
    () => this.actions$.pipe(
      ofType(profileActions.getMeEvent),
      switchMap(() => this.profileService.getMe()),
      map(response => profileActions.meLoadedEvent({me: response}))
    )
  );

  // switchMap(
  //   response => of(
  //     profileActions.meLoaded({me: response}),
  //     //profileActions.avatarUrlLoaded({avatarUrl: response.avatarUrl})
  //   )
  // )
}
