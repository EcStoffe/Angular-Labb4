import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(private authService: AuthService) { }
  @Input() friends;

  ngOnInit() {
  }

}
