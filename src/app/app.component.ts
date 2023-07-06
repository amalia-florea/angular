import { Component } from '@angular/core';
import { UserService } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from './pokemon.service';
import { searchValidator } from './shared/search.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pokemon';

  isAdmin: boolean = this._userService.isAdmin;

  searchForm!: FormGroup;

  errorMsg: any;

  get search() {
    return this.searchForm.get('search')!;
  }  

  constructor(private _router: Router, private fb: FormBuilder, private _pokemonService: PokemonService, private _userService: UserService) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['', [Validators.required, Validators.minLength(3), searchValidator(new RegExp("^[a-zA-Z0-9 ]+$"))]]
    });
  }

  onSubmit() { 
    this._pokemonService.searchPokemon(this.searchForm.value.search)
    .subscribe({
      next: (id: number) => {
        this._router.navigate(['/detail', id]); 
      },
      error: (error) => {this.errorMsg = error }});    
  }  
}
