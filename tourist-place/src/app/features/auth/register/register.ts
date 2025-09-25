import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width:420px;margin:48px auto;display:block;">
      <h2>Create account</h2>
      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" required />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" required />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" required />
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Register</button>
      <a routerLink="/auth/login" style="margin-left:12px;">Back to login</a>
    </form>
  `,
  styles: ``
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  loading = false;
  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] })
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.getRawValue();
    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
