import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IPokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';
import { IPokemonSpecies } from '../pokemon-species';
import { IPokemonEvolution } from '../pokemon-evolution';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent {
  pokemon: IPokemon | undefined;
  pokemonSpecies: IPokemonSpecies | undefined;
  pokemonEvolution: IPokemonEvolution[] | undefined;
  errorMsg: any;
  typeColorList: { [key: string]: string } = {};
  private typeURLs: string[] = [];
  damageWhenAttacked: string[] = [];
  damageFirstColumnEnd: number = 0;
  damageSecondColumnEnd: number = 0;  

  constructor(private _router: Router, private _route: ActivatedRoute, private _pokemonService: PokemonService) {
    var pokemonId = parseInt(_route.snapshot.paramMap.get('id') as string);

    if (isNaN(pokemonId) == true) {
      this._router.navigate(['home']); 
      return;
    }    
  }

  ngOnInit() {
    this._route.paramMap.subscribe((params: ParamMap) => {
      var pokemonId = parseInt(params.get('id') as string);

      if (isNaN(pokemonId) == true) {
        this._router.navigate(['home']); 
        return;
      }

      forkJoin({
        pokemon: this._pokemonService.getPokemon(pokemonId),
        pokemonSpecies: this._pokemonService.getPokemonSpecies(pokemonId),
        pokemonEvolution: this._pokemonService.getPokemonEvolution(pokemonId)
      })
      .subscribe({
        next: (data: {pokemon: IPokemon, pokemonSpecies: IPokemonSpecies, pokemonEvolution: IPokemonEvolution[]}) => {
          this.pokemon = data.pokemon;  
          this.typeColorList = this._pokemonService.typeColorList;
          this.typeURLs = this._pokemonService.typeURLs;
    
          if (this.typeURLs.length) {
            this.getPokemonDamageWhenAttacked(this.typeURLs);
          }
  
          this.pokemonSpecies = data.pokemonSpecies; 
  
          this.pokemonEvolution = data.pokemonEvolution; 
  
          this.getPokemonEvolution(data.pokemonEvolution);         
        },
        error: (error) => this.errorMsg = error }); 
    });
  }
  
  getPokemonDamageWhenAttacked(typeURLs: string[]) {
    for (let i = 0; i < typeURLs.length; i++) {
      this._pokemonService.getPokemonType(typeURLs[i])    
        .subscribe({
          next: (data: any) => {
            this.damageWhenAttacked = this.damageWhenAttacked
              .concat(data.filter((item: string) =>  this.damageWhenAttacked.indexOf(item) < 0)); 

            this.damageFirstColumnEnd = Math.round(this.damageWhenAttacked.length / 2);  
            this.damageSecondColumnEnd = this.damageWhenAttacked.length;
          },
          error: (error) => this.errorMsg = error });   
    }
  } 

  getPokemonEvolution(pokemonEvolution: IPokemonEvolution[]) {
    for (let i = 0; i <  pokemonEvolution.length; i++) {
      this._pokemonService.searchPokemon(pokemonEvolution[i].name)
      .subscribe({
        next: (id: number) => {
          this.pokemonEvolution![i].evolvesTo = id;
        },
        error: (error) => this.errorMsg = error }); 
    }
  }  
}
