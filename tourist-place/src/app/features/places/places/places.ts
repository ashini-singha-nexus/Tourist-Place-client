import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlacesService } from '../places.service';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-places',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatDialogModule, NgFor, NgIf],
  template: `
    <mat-toolbar color="primary">
      <span>Tourist Places</span>
      <span style="flex:1 1 auto"></span>
      <button mat-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
        {{ username || 'User' }}
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="logout()">Logout</button>
      </mat-menu>
    </mat-toolbar>

    <div style="max-width:900px;margin:24px auto;">
      <div style="text-align:right;margin-bottom:12px;">
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Create Place
        </button>
      </div>

      <div *ngIf="places?.length">
        <div *ngFor="let p of places" style="border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="margin:0;">{{ p.title }}</h3>
              <small>{{ p.location }}</small>
            </div>
            <div>
              <button mat-button color="primary" (click)="openEditDialog(p)">Edit</button>
              <button mat-button color="warn" (click)="confirmDelete(p)">Delete</button>
            </div>
          </div>
          <p style="margin-top:8px;">{{ p.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class Places {
  private readonly api = inject(PlacesService);
  private readonly auth = inject(Auth);
  private readonly dialog = inject(MatDialog);
  places: any[] = [];
  username: string | null = null;

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })
  });

  ngOnInit(): void {
    this.username = this.auth.getUsername();
    this.refresh();
  }

  refresh(): void {
    this.api.list().subscribe({
      next: (items: any[]) => {
        this.places = items as any[];
      }
    });
  }

  edit(p: any): void {
    const updated = { ...p, title: p.title + ' (edited)' };
    this.api.update(p.id, updated).subscribe({ next: () => this.refresh() });
  }

  remove(p: any): void {
    this.api.delete(p.id).subscribe({ next: () => this.refresh() });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PlaceDialog, { data: { mode: 'create' } });
    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.create(payload).subscribe({ next: () => this.refresh() });
    });
  }

  openEditDialog(p: any): void {
    const dialogRef = this.dialog.open(PlaceDialog, { data: { mode: 'edit', place: p } });
    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.update(p.id, payload).subscribe({ next: () => this.refresh() });
    });
  }

  confirmDelete(p: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { title: p.title } });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;
      this.api.delete(p.id).subscribe({ next: () => this.refresh() });
    });
  }

  logout(): void {
    this.auth.logout();
    location.href = '/auth/login';
  }
}

@Component({
  selector: 'app-place-dialog',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgIf],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create Place' : 'Edit Place' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" style="display:block;padding:0 24px 24px;">
      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Location</mat-label>
        <input matInput formControlName="location" />
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%;margin-top:12px;">
        <mat-label>Description</mat-label>
        <textarea matInput rows="3" formControlName="description"></textarea>
      </mat-form-field>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end;">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data.mode === 'create' ? 'Create' : 'Update' }}
        </button>
      </div>
    </form>
  `,
  styles: ``
})
export class PlaceDialog {
  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PlaceDialog>) {
    if (data?.place) {
      this.form.patchValue({
        title: data.place.title,
        description: data.place.description,
        location: data.place.location
      });
    }
  }
  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Delete Place</h2>
    <div style="padding:0 24px 24px;">
      Are you sure you want to delete "{{ data.title }}"?
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end;">
        <button mat-button [mat-dialog-close]="false">Cancel</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
      </div>
    </div>
  `,
  styles: ``
})
export class DeleteConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
