import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {debounceTime, startWith, Subscription} from 'rxjs';
import {profileActions, selectSearchFilter} from "@tt/profile";
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
  selectFilterEvent = this.store.selectSignal(selectSearchFilter)

  searchForm: FormGroup = this.fb.group({
    firstName: [this.selectFilterEvent().firstName],
    lastName: [this.selectFilterEvent().lastName],
    stack: [this.selectFilterEvent().stack],
  });

  ngOnInit() {
    this.sub = this.searchForm.valueChanges
      .pipe(
        startWith({
          firstName: this.selectFilterEvent().firstName,
          lastName: this.selectFilterEvent().lastName,
          stack: this.selectFilterEvent().stack
        }),
        debounceTime(500)
      )
      .subscribe((formValue) => {
        this.store.dispatch(profileActions.filterEvent({filters: formValue}));
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
