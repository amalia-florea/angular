import { AbstractControl, ValidatorFn } from "@angular/forms";

export function productValidator(expt: RegExp): ValidatorFn {
    return (control: AbstractControl) : {[key: string]: any } | null => {    
        return control.value === '' || expt.test(control.value) ? null : { 'forbiddenName': { value: control.value }};  
    }  
}