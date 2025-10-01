import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  passwordVisible = false;

  showPassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  form = new FormGroup({
    firstName: new FormControl<string | null>(null, Validators.required),
    lastName: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    phoneNumber: new FormControl<string | null>(null, Validators.required),
    dateOfBirth: new FormControl<Date | null>(null, Validators.required),
    gender: new FormControl<string | null>(null, Validators.required),
    idNumber: new FormControl<string | null>(null, Validators.required),
    digitalAddress: new FormControl<string | null>(null, Validators.required),
    residentialAddress: new FormControl<string | null>(null, Validators.required),
    regionId: new FormControl<string | null>(null, Validators.required),
    district: new FormControl<string | null>(null, Validators.required),
    typeOfPractionerId: new FormControl<string | null>(null, Validators.required),
    specializationId: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
    confirmPassword: new FormControl<string | null>(null, Validators.required),
  })

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
