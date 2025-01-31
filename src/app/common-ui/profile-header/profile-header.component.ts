import {Component, inject, input} from '@angular/core';
import {Profile} from "../../data/interfaces/profile.interface";
import {ImgUrlPipe} from "../../helpers/pipe/img-url.pipe";
import {ProfileService} from "../../data/services/profile.service";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profileService = inject(ProfileService);
  profile = input<Profile>()
}
