import {Component, Input} from '@angular/core';
import {Profile} from "../../data/interfaces/profile.interface";
import {AvatarCircleComponent} from "../avatar-circle/avatar-circle.component";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
