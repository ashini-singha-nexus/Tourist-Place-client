import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width:420px;margin:48px auto;display:block;">
      <h2>Login</h2>
      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" required />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" required />
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Login</button>
      <a routerLink="/auth/register" style="margin-left:12px;">Create account</a>
    </form>
  `,
  styles: ``
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  loading = false;
  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { username, password } = this.form.getRawValue();
    this.auth.login({ username, password }).subscribe({
      next: (result) => {
        this.loading = false;
        this.router.navigate(['/places']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
