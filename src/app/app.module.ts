import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, fab);

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';

import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { HeaderComponent } from './header/header.component';
import { DataService } from './core/service/data.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    StudentHomeComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    PanelModule,
    ToastModule,
    DialogModule,
    CalendarModule,
    MessagesModule,
    MessageModule,
    FontAwesomeModule,
    TableModule,
    HttpClientModule,
    RadioButtonModule,
    MultiSelectModule,
  ],
  providers: [DataService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
