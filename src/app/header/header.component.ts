import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isProfileVisible: boolean;

  constructor(public router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.profileDetails$.subscribe((data) => {
      this.isProfileVisible = data;
    });
  }
}
