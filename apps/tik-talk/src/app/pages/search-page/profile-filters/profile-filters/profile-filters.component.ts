import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {debounceTime, startWith, Subscription, switchMap} from 'rxjs';
import {ProfileService} from "@tt/profile";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit, OnDestroy {
  profileService: ProfileService = inject(ProfileService);
  fb: FormBuilder = inject(FormBuilder);
  sub!: Subscription;

  searchForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  ngOnInit() {
    this.sub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(1000),
        switchMap((form) => {
          return this.profileService.filterProfiles(form);
        })
      )
      .subscribe((_) => {
        //console.log(profiles);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
