import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs';
import {Pagable} from "@tt/shared";
import {baseUrl} from "@tt/globals";
import {Profile} from "@tt/interfaces/profile";

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  #http = inject(HttpClient);

  getAccount(id: string) {
    return this.#http.get<Profile>(`${baseUrl}account/${id}`);
  }

  getMe() {
    return this.#http.get<Profile>(`${baseUrl}account/me`).pipe(
      map(me => {
        return {
          ...me,
          updateTime: Date.now()
        };
      })
    )
  }

  getSubscribersShortList(amount: number = 3) {
    return this.#http
      .get<Pagable<Profile>>(`${baseUrl}account/subscribers/`)
      .pipe(map((data) => data.items.slice(0, amount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.#http.patch(`${baseUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.#http
      .post<Profile>(`${baseUrl}account/upload_image`, fd)
    //.pipe(tap((data) => this.avatarUrl.set(data.avatarUrl)));
  }

  filterProfiles(params: Record<string, any>) {
    return this.#http
      .get<Pagable<Profile>>(`${baseUrl}account/accounts`, {
        params,
      })
  }
}
