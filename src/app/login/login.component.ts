import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../core/service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
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
