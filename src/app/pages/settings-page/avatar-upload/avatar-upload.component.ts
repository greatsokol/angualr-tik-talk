import {Component, inject, signal} from '@angular/core';
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {DragNDropDirective} from "../../../common-ui/directives/drag-n-drop.directive";
import {FormsModule} from "@angular/forms";
import {ProfileService} from "../../../data/services/profile.service";
import {ImgUrlPipe} from "../../../helpers/pipe/img-url.pipe";

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [
    SvgIconComponent,
    DragNDropDirective,
    FormsModule,
    ImgUrlPipe
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  preview = signal<string | null | undefined | ArrayBuffer>(null);
  profileService: ProfileService = inject(ProfileService);
  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.uploadFile(file);
  }

  fileDropHandler(file: File) {
    this.uploadFile(file);
  }

  private uploadFile(file: File | undefined) {
    if (!file || !file.type.match('image')) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.preview.set(reader.result ?? '');
    }
    reader.readAsDataURL(file);
    this.avatar = file;
  }

}
