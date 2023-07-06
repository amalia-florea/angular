import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAdmin = true;
  
  constructor(private _router: Router) { }

  canActivate(): boolean {

    if (this.isAdmin === false) {
      this._router.navigate(['/home']);
    }

    return this.isAdmin;
  }  
}