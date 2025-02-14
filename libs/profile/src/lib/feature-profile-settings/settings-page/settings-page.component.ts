import {Component, effect, inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {ProfileService} from "@tt/profile";
import {AvatarUploadComponent, ProfileHeaderComponent} from "../../ui";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fb: FormBuilder = inject(FormBuilder);
  profileService: ProfileService = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.profileService.me(),
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  onSaveBtnClick() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    firstValueFrom(
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
    );
  }

  splitStack(stack: null | undefined | string | string[]): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;
    return stack.split(',').map((skill) => skill.trim());
  }

  mergeStack(stack: null | undefined | string | string[]): string {
    if (!stack) return '';
    if (Array.isArray(stack))
      return stack.map((skill) => skill.trim()).join(',');
    return stack
      .split(',')
      .map((skill) => skill.trim())
      .join(',');
  }
}
