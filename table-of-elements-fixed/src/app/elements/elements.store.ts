import { Injectable, computed, signal } from '@angular/core';
import { timer } from 'rxjs';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Injectable({ providedIn: 'root' })
export class ElementsStore {
  private readonly _elements = signal<PeriodicElement[]>([]);
  private readonly _filter = signal('');

  readonly elements = this._elements.asReadonly();
  readonly filter = this._filter.asReadonly();

  readonly filteredElements = computed(() => {
    const filter = this._filter().toLowerCase();
    if (!filter) {
      return this._elements();
    }
    return this._elements().filter((e) =>
      `${e.position} ${e.name} ${e.weight} ${e.symbol}`
        .toLowerCase()
        .includes(filter)
    );
  });

  constructor() {
    // Simulate async data loading
    timer(500).subscribe(() => this._elements.set(ELEMENT_DATA));
  }

  updateFilter(value: string) {
    this._filter.set(value);
  }

  updateElement(updated: PeriodicElement) {
    this._elements.set(
      this._elements().map((e) =>
        e.position === updated.position ? { ...updated } : e
      )
    );
  }
}