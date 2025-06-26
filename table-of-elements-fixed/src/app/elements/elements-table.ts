import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { ElementsStore, PeriodicElement } from './elements.store';
import { EditElementDialogComponent } from './edit-element-dialog';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './elements-table.html',
  styleUrls: ['./elements-table.css'],
})
export class ElementsTableComponent {
  private store = inject(ElementsStore);
  private dialog = inject(MatDialog);

  columns = ['position', 'name', 'weight', 'symbol', 'actions'];
  filterControl = new FormControl('', { nonNullable: true });

 get data(): PeriodicElement[] {
  return this.store.filteredElements(); 
}

  constructor() {
    this.filterControl.valueChanges
      .pipe(debounceTime(2000))
      .subscribe((value) => this.store.updateFilter(value));
  }

  edit(element: PeriodicElement) {
    this.dialog
      .open(EditElementDialogComponent, { data: { ...element } })
      .afterClosed()
      .subscribe((result: PeriodicElement | undefined) => {
        if (result) {
          this.store.updateElement(result);
        }
      });
  }
}