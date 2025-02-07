import {Component, inject} from '@angular/core';
import {ProfileCardComponent} from '../../common-ui/profile-card/profile-card.component';
import {ProfileFiltersComponent} from './profile-filters/profile-filters/profile-filters.component';
import {ProfileService} from "@tt/profile";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService: ProfileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles;
}
