import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DragNDropDirective, ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService, selectMe} from "@tt/profile";
import {Store} from "@ngrx/store";


@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DragNDropDirective, FormsModule, ImgUrlPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  profileService: ProfileService = inject(ProfileService);
  store = inject(Store);

  preview = signal<string | null | undefined | ArrayBuffer>(null);
  me = this.store.selectSignal(selectMe);
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
    };
    reader.readAsDataURL(file);
    this.avatar = file;

  }

}
