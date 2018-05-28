import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';


// ...
interface AuthResponse {
  token: string;
}

interface User {
  sub: string;
  name: string;
}


// ...
@Injectable()
export class AuthService {

  // the decoded token if the user has been authenticated, carrying information about the user.
  _user: User;
  friends;
  token;

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem("user")) {
      this.token = localStorage.getItem("user");
      this._user = jwt_decode(this.token);
    }
  }

  // ...
  // The following computed properties may come in handy in the markup in your template...
  get user() {
    return this._user;
  }

  get authenticated() {
    return this._user !== undefined;
  }

  // use this method to catch http errors.
  handleError(error: HttpErrorResponse) {
    return Observable.throw({
      error: error.error
    });
  }

  login(credentials) {
    //console.log(credentials);
    const ob = this.http.post('/login', credentials);
    ob.subscribe((result: any) => {
      this.token = result.token;
      const decoded = jwt_decode(result.token);
      this._user = decoded;
      localStorage.setItem('user', result.token);
      this.router.navigate(['/friends'])
    }, (error) => {
      console.log('Ops, nu gick det snett', error)
    });
    return ob;

  }

  logout() {
    // logout the current user by removing the corresponding token.
    this._user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login'])
  }


  getResource(resource): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    const myFriends = this.http.get(resource, option);
    myFriends.subscribe((result: any) => {
        this.friends = result;
      },
      error => {
        console.log('Nu blev det fel igen', error)
      });
    return myFriends;
  }
}
