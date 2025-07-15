import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MockService} from "../data";
import {NameValidator} from "./name.validator";

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

function validateStartWith(forbiddenLetter: String): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.toLowerCase().startsWith(forbiddenLetter)
      ? {startWith: {message: `${forbiddenLetter} не используем!`}}
      : null
  }
}

function validateDateRange({fromControlName, toControlName}: {
  fromControlName: string,
  toControlName: string
}): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromControl: AbstractControl | null = control.get(fromControlName);
    const toControl: AbstractControl | null = control.get(toControlName);
    if (!fromControl || !toControl) return null;
    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      const err = {dateRange: {message: 'Дата начала не может быть позднее даты конца'}}
      fromControl.setErrors(err);
      toControl.setErrors(err);
      return err;
    }

    return null;
  }
}

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
  #nameValidator = inject(NameValidator);

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
    name: this.#fb.nonNullable.control<string>('Lucas', {
        validators: [Validators.required, validateStartWith('я')],
        asyncValidators: [this.#nameValidator.validate.bind(this.#nameValidator)],
        updateOn: "blur"
      }
      ,
    ),
    inn: this.#fb.control<string>('fsdfsdfsd'),
    lastName: this.#fb.control<string>('dsfasdf'),
    addresses: this.#fb.array([this.createAddressFormGroup({})]),
    feature: this.#fb.record<boolean>({}),
    dateRange: this.#fb.group({
      from: this.#fb.control<string>(''),
      to: this.#fb.control<string>(''),
    }, {
      validators: validateDateRange({fromControlName: 'from', toControlName: 'to'})
    })
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
