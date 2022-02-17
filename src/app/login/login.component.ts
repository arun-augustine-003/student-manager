import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    document.body.style.backgroundColor = '#363d93';
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });

    this.initHeader();
  }

  ngOnDestroy() {}

  login() {
    if (this.loginForm.valid) {
      this.router.navigate(['/student-home']);
    }
  }

  initHeader() {
    this.dataService.setProfileVisibility(false);
  }
}
