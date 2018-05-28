import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes} from "@angular/router";

import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth-interceptor';
import { AppComponent } from './app.component';
import { FriendsComponent} from "./friends/friends.component";

const appRoutes: Routes = [
  { path: 'friends', component: FriendsComponent },
  { path: 'login', component: AppComponent},
  { path: '', component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    FriendsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide:
      HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true },
    AuthService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
