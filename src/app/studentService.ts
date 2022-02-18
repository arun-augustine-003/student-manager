import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Student } from './student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getStudents() {
    return this.http.get<any>('http://localhost:3002/students/').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getTeachers() {
    return this.http.get<any>('http://localhost:3002/teachers/').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  deleteStudent(id: number) {
    return this.http.delete<any>('http://localhost:3002/students/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  addStudent(data: Student) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post<any>('http://localhost:3002/students/', data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateStudent(data: Student) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .put<any>('http://localhost:3002/students/' + data.id, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
