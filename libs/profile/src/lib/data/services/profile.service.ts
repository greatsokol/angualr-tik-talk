import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../interfaces/profile.interface';

import {map, tap} from 'rxjs';
import {Pagable} from "@tt/shared";
import {baseUrl} from "@tt/globals";

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);
  avatarUrl = signal<string | null>(null);

  getAccount(id: string) {
    return this.http.get<Profile>(`${baseUrl}account/${id}`);
  }

  getMe() {
    return this.http.get<Profile>(`${baseUrl}account/me`).pipe(
      tap((data) => {
        this.me.set(data);
        this.avatarUrl.set(data.avatarUrl);
      })
    );
  }

  getSubscribersShortList(amount: number = 3) {
    return this.http
      .get<Pagable<Profile>>(`${baseUrl}account/subscribers/`)
      .pipe(map((data) => data.items.slice(0, amount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch(`${baseUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http
      .post<Profile>(`${baseUrl}account/upload_image`, fd)
      .pipe(tap((data) => this.avatarUrl.set(data.avatarUrl)));
  }

  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pagable<Profile>>(`${baseUrl}account/accounts`, {
        params,
      })
      .pipe(tap((data) => this.filteredProfiles.set(data.items)));
  }
}
