import {Component, Input} from '@angular/core';
import {AvatarCircleComponent} from "@tt/common-ui";
import {Profile} from "@tt/profile";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
