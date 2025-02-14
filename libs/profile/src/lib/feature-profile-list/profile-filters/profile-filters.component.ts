import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {debounceTime, startWith, Subscription} from 'rxjs';
import {profileActions} from "@tt/profile";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit, OnDestroy {
  store: Store<any> = inject(Store)

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
        debounceTime(1000)
      )
      .subscribe((formValue) => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}));
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
