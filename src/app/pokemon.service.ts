import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IPokemon } from './pokemon';
import { IPokemonSpecies } from './pokemon-species';
import { IPokemonEvolution } from './pokemon-evolution';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  limit: number = 28;
  private _url: string = "https://pokeapi.co/api/v2/pokemon/?limit=" + this.limit;
  private _urlDetail: string = "https://pokeapi.co/api/v2/pokemon/";
  private _urlSearch: string = "https://pokeapi.co/api/v2/pokemon/";
  private _urlSpecies: string = "https://pokeapi.co/api/v2/pokemon-species/";
  private _urlEvolution: string = "https://pokeapi.co/api/v2/evolution-chain/";

  letters = '0123456789ABCDEF';
  typeColorList: { [key: string]: string } = {};
  typeURLs: string[] = [];

  constructor(private http: HttpClient) { }

  getPokemons(pageNumber: number) : Observable<IPokemon[]>  { 
    return this.http.get<IPokemon[]>(this._url + "&offset=" + (pageNumber * this.limit))
      .pipe(
          map((response: any): IPokemon[] => 
            response.results.map((item: any): IPokemon => ({
              id: parseInt(item.url.split('/')[item.url.split('/').length - 2]),
              name: item.name,
              height: 0,
              weight: 0,
              hp: 0,
              attack: 0,
              defence: 0,
              speed: 0,
              special_attack: 0,
              special_defence: 0,
              types: [],
              abilities: []
            }))
          ),
          catchError(this.ErrorHandler)
        );
  }

  getPokemon(id: number) : Observable<IPokemon>  { 
    return this.http.get<IPokemon>(this._urlDetail + id)
      .pipe(
        map((response: any): IPokemon => ({
            id: response.id,
            name: response.name,
            height: response.height,
            weight: response.weight,
            hp: response.stats[0].base_stat,
            attack: response.stats[1].base_stat,
            defence: response.stats[2].base_stat,
            speed: response.stats[5].base_stat,
            special_attack: response.stats[3].base_stat,
            special_defence: response.stats[4].base_stat,
            types: response.types.map((type: any) => {
              this.setTypeColor(type.type.name.name);

              this.typeURLs.push(type.type.url);       

              return type.type.name;
            }),
            abilities: response.abilities.filter(function (ability: any) {
              return ability.is_hidden === false;
            }).map((ability: any) => ability.ability.name)            
          })
        ),       
        catchError(this.ErrorHandler)
      );
  }

  getPokemonSpecies(id: number) : Observable<IPokemonSpecies>  { 
    return this.http.get<IPokemonSpecies>(this._urlSpecies + id)
      .pipe(
        map((response: any): IPokemonSpecies => ({
            name: response.genera.find((element: { language: { name: string; }; }) => element.language.name === 'en').genus,
            color: response.color.name,
            description: response.flavor_text_entries.find((element: { language: { name: string; }; }) => element.language.name === 'en').flavor_text,
            gender_rate: response.gender_rate,
            egg_groups: response.egg_groups.map((group: any) => { 
              return group.name;
            }),
            hatch_steps: response.hatch_counter,
            catch_rate: response.capture_rate
          })
        ),
        catchError(this.ErrorHandler)
      );
  }

  getPokemonType(url: string) : Observable<string[]>  { 
    return this.http.get<string[]>(url)
      .pipe(
          map((response: any): string[] => {  

            let double_damage_from = response.damage_relations.double_damage_from.map((damage: any) => {
              this.setTypeColor(damage.name);

              return damage.name;         
            });
            
            let half_damage_from = response.damage_relations.half_damage_from.map((damage: any) => {
              this.setTypeColor(damage.name);
                            
              return damage.name;
            });            

            return double_damage_from.concat(half_damage_from);
          }
        ),
        catchError(this.ErrorHandler)
      );
  }  

  getPokemonEvolution(id: number) : Observable<IPokemonEvolution[]>  { 
    return this.http.get<IPokemonEvolution[]>(this._urlEvolution + id)
      .pipe(
          map((response: any): IPokemonEvolution[] => { 
            let evoChain: IPokemonEvolution[] = [];

            for (let i = 0; i < response.chain.evolves_to.length; i++) {         

              evoChain.push({
                name:  response.chain.evolves_to[i].species.name,
                level:  response.chain.evolves_to[i].evolution_details[0].min_level,
                evolvesTo: 0
              });             
            }

            return evoChain;
          }
        ),
        catchError(this.ErrorHandler)
      );
  }  

  searchPokemon(search: string) : Observable<number> { 
    return this.http.get<number>(this._urlSearch + search.toLowerCase())
      .pipe(
        map((response: any): number => response.id),       
        catchError(this.ErrorHandler)
      );
  }

  setTypeColor(typeName: string) {
      if (this.typeColorList[typeName] === undefined) {
        let color = '#';
        do {
          for (var i = 0; i < 6; i++) {
            color += this.letters[Math.floor(Math.random() * 16)];
          }
        } while (Object.values(this.typeColorList).indexOf(color) >= 0);

        this.typeColorList[typeName] = color; 
      }    
  }

  ErrorHandler(error: HttpErrorResponse) {
    return throwError(() => error);
  }   
}
