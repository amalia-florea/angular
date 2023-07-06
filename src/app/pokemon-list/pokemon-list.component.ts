import { Component } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { IPokemon } from '../pokemon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent {
  pokemons : Array<IPokemon> = [];
  errorMsg: any;

  currentPage: number = 1;
  lastPage = 0;

  loader: boolean = true;

  constructor(private _router: Router, private _pokemonService: PokemonService) {}

  ngOnInit() {
     this.getPokemons();
  } 

  getPokemons(pageNumber = 1) {
    this._pokemonService.getPokemons(pageNumber)
    .subscribe({
      next: (data: any) => {
        this.pokemons = data;
        this.currentPage = pageNumber;  

        if (this.pokemons.length < this._pokemonService.limit) {
          this.lastPage = 1;
        }
        
        this.loader = false; 
      },
      error: (error) => this.errorMsg = error });   
  }

  onSelect(pokemon: { id: any; }) {
    this._router.navigate(['/detail', pokemon.id]);
  }  
}
