import { Component } from '@angular/core';
import { AuthService } from './auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {

  credentials = {
    username: '',
    password: ''
  };

  isError = false;
  friends;

  constructor(private authService: AuthService) {}


  login() {
      this.authService.login(this.credentials)
        .subscribe(() => {
          this.isError = false;
          },
          (error) => {
            console.log('Här gick det inte som väntat', error);
            this.isError = true;
          }
        );
      this.credentials = { username: '', password: ''}
  }

  logout() {
    this.authService.logout();
  }

  testApi() {
    this.authService.getResource('/friends').subscribe((result) => {
      this.friends = result.friends;
    });
  }

  isValidForm() {
    return this.credentials.username.length < 1 || this.credentials.password.length < 8
  }
  }
