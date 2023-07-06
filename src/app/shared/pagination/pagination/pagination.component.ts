import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage!: number | 0;
  @Input() lastPage!: number | 0;

  @Output() pageChangedEvent = new EventEmitter();
  getPokemons(selectedPageNumber: number)
  {
    this.pageChangedEvent.emit(selectedPageNumber);
  }  
}
