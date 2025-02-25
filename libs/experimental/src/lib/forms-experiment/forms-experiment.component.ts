import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MockService} from "../data";

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL'
}

interface Address {
  city?: string,
  street?: string,
  building?: number | null,
  apartment?: number | null
}

interface Feature {
  code: string,
  label: string,
  value: boolean
}

// function getAddressForm() {
//   return new FormGroup({
//     city: new FormControl<string>(''),
//     street: new FormControl<string>(''),
//     building: new FormControl<number | null>(null),
//     apartment: new FormControl<number | null>(null)
//   });
// }

@Component({
  selector: 'tt-forms-experiment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss'
})
export class FormsExperimentComponent {
  #fb = inject(FormBuilder);
  #mockService = inject(MockService);

  ReceiverType = ReceiverType;
  features: Feature[] = [];

  // form = new FormGroup({
  //   type: new FormControl<ReceiverType>(ReceiverType.PERSON),
  //   name: new FormControl<string>('', Validators.required),
  //   inn: new FormControl<string>(''),
  //   lastName: new FormControl<string>('ЗНАЧЕНИЕ'),
  //   address: getAddressForm()
  // })

  form = this.#fb.group({
    type: this.#fb.control<ReceiverType>(ReceiverType.PERSON),
    name: this.#fb.nonNullable.control<string>('Lucas'),
    inn: this.#fb.control<string>('fsdfsdfsd'),
    lastName: this.#fb.control<string>('dsfasdf'),
    addresses: this.#fb.array([this.createAddressFormGroup({})]),
    feature: this.#fb.record<boolean>({})
  });

  constructor() {
    this.#mockService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addresses => {
        // while (this.form.controls.addresses.controls.length > 0) {
        //   this.form.controls.addresses.removeAt(0);
        // }
        this.form.controls.addresses.clear();
        for (const addr of addresses) {
          this.form.controls.addresses.push(this.createAddressFormGroup(addr))
        }
      });

    this.#mockService.getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features;
        console.log(features);
        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
      });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => {
        this.form.controls.inn.clearValidators();

        if (val === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators(
            [Validators.required, Validators.minLength(10), Validators.maxLength(10)]
          );
        }
      });
  }

  onSubmit(event: SubmitEvent) {
    //this.form.reset();
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()
    if (this.form.invalid) return
    //
    console.log('this.form.value', this.form.value);
    //   console.log('getRawValue', this.form.getRawValue());
  }

  addAddress() {
    this.form.controls.addresses.insert(0, this.createAddressFormGroup({}), {emitEvent: false});
    //this.form.controls.addresses.push(this.createAddressFormGroup(), {emitEvent: false});
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, {emitEvent: false});
  }

  createAddressFormGroup(initialValue: Address) {
    return this.#fb.group({
      city: this.#fb.control<string>(initialValue.city ?? ''),
      street: this.#fb.control<string>(initialValue.street ?? ''),
      building: this.#fb.control<number | null>(initialValue.building ?? null),
      apartment: this.#fb.control<number | null>(initialValue.apartment ?? null)
    })
  }

  noSortOfFeatures = () => 0;
}
