import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../core/service/data.service';
import { ITheme } from '../core/interfaces/index';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  isProfileVisible: boolean;
  themes: ITheme[];
  selectedTheme: ITheme;

  constructor(public router: Router, private dataService: DataService) {
    this.themes = [
      { name: 'Default', id: 'default-theme' },
      { name: 'Blue', id: 'blue-theme' },
      { name: 'Red', id: 'red-theme' },
      { name: 'Green', id: 'green-theme' },
      { name: 'Dark', id: 'dark-theme' },
    ];
    this.selectedTheme = { name: 'Default', id: 'default-theme' };
  }

  ngOnInit() {
    this.dataService.profileDetails$.subscribe((data) => {
      this.isProfileVisible = data;
    });
    document.body.classList.add(this.selectedTheme.id);
  }

  onChangeTheme(event) {
    this.themes.forEach((theme) => document.body.classList.remove(theme.id));
    document.body.classList.add(event.value.id);
  }
}
