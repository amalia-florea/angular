import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { UserService } from './user.service';
import { ProductService } from './product.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: PokemonListComponent },
  { path: 'detail', component: PokemonDetailComponent },  
  { path: 'detail/:id', component: PokemonDetailComponent },
  { path: 'create-product', canActivate: [() => inject(UserService).canActivate()], component: ProductAddComponent },
  { path: 'product-list', canActivate: [() => inject(UserService).canActivate(), () => inject(ProductService).canActivate()], component: ProductListComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [PokemonListComponent,
                                  PokemonDetailComponent,
                                  ProductListComponent,
                                  ProductAddComponent]
