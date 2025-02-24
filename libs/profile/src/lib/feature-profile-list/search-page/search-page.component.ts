import {Component, inject} from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import {ProfileFiltersComponent} from '../profile-filters/profile-filters.component';

import {Store} from "@ngrx/store";
import {profileActions, ProfileService, selectFilteredProfiles} from '../../data';
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {firstValueFrom, scan, Subject} from "rxjs";
import {Profile} from "@tt/interfaces/profile";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, InfiniteScrollDirective],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  store: Store<any> = inject(Store)

  profiles = this.store.selectSignal(selectFilteredProfiles);

  // method 4 ----------------------------------------------------
  // profileService = inject(ProfileService);
  // profilesSubject$ = new Subject<Profile[]>();
  // infiniteProfiles$ = this.profilesSubject$
  //   .pipe(
  //     scan((acc, curr) => {
  //       return acc.concat(curr);
  //     }, [] as Profile[])
  //   );
  // page = 0;
  //
  // ngOnInit() {
  //   this.getNextPage();
  // }
  //
  // async getNextPage() {
  //   this.page += 1;
  //   const res = await firstValueFrom(this.profileService.filterProfiles({page: this.page}));
  //   this.profilesSubject$.next(res.items);
  // }

// --------------------------------------------------------------

  timeToFetchNext() {
    this.store.dispatch(profileActions.setPage({}))
  }

// method 2
  onIntersection(entries
                 :
                 IntersectionObserverEntry[]
  ) {
    if (!entries.length) return;
    if (entries[0].intersectionRatio > 0) {
      this.timeToFetchNext();
    }
  }

// method 3
  onScroll() {
    this.timeToFetchNext();
    //this.getNextPage();  // method 4
  }
}
