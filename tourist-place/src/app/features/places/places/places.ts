import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-places',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgFor, NgIf],
  template: `
    <div style="max-width:900px;margin:24px auto;">
      <form [formGroup]="form" (ngSubmit)="create()" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end;">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" required />
        </mat-form-field>
        <mat-form-field appearance="outline" style="grid-column:1 / -1;">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" required></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Add Place</button>
      </form>

      <div *ngIf="places?.length" style="margin-top:24px;">
        <div *ngFor="let p of places" style="border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="margin:0;">{{ p.title }}</h3>
              <small>{{ p.location }}</small>
            </div>
            <div>
              <button mat-button color="primary" (click)="edit(p)">Edit</button>
              <button mat-button color="warn" (click)="remove(p)">Delete</button>
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
  places: any[] = [];

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.list().subscribe({
      next: (items: any[]) => {
        this.places = items as any[];
      }
    });
  }

  create(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    this.api.create(payload).subscribe({
      next: () => {
        this.form.reset();
        this.refresh();
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
}
