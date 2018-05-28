import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse,
  HttpHandler
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import {headersToString} from "selenium-webdriver/http";


// ...
// Example of user credentials to match against incoming credentials.

const username = 'me@domain.com';
const password = 'password';


// list of friends to return when the route /api/friends is invoked.
const friends =['alice', 'bob', 'Earl Blacksmith'];

// the hardcoded JWT access token you created @ jwt.io.
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkjDpHJza2FyZW4iLCJpYXQiOjE1MTYyMzkwMjJ9.G_T2NzcU7oREoVhbC1feLxo9KVz7HTTV2ULa-lJNhMo';


// ...
// Use these methods in the implementation of the intercept method below to return either a success or failure response.
const makeError = (status, error) => {
    return Observable.throw(
        new HttpErrorResponse({
            status,
            error
        })
    );
};

const makeResponse = body => {
    return of(
        new HttpResponse({
            status: 200,
            body
        })
    );
};

// ...

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { 
        body,       // object
        headers,    // object
        method,     // string
        url,        // string
    } = req;


    if(url === '/login') {
      if(body.username === username && body.password === password) {
       return makeResponse({
            token: token
    });
    } else {
       console.log('Error: ', makeError(401, {}));
       return makeError(401, {});
      }
  } else {
      makeError(500, {})
    }

    // implement logic for handling API requests, as defined in the exercise instructions.
    if(url === '/friends') {
      if(headers.has('Authorization')) {
        if(headers.get('Authorization') === `Bearer ${token}`) {
          return makeResponse({
            friends
          })
        }
          else {
          return makeError(401, 'Unauthorized token')
          }

        }
          else {
          return makeError(400, 'No authorization token')
          }

        }
          else {
          return makeError(500, {})
          }
  }
}
