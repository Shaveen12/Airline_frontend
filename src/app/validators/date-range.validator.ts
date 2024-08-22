import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && endDate < startDate) {
      return { dateRangeInvalid: true }; // Return an error object if the validation fails
    }
    return null; // Return null if validation is successful
  };
}
