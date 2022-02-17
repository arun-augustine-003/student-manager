import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentView } from '../studentView';
import { Teacher } from '../teacher';
import { Rating } from '../rating';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { StudentService } from '../studentService';
import { DataService } from '../data.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss'],
  providers: [MessageService],
})
export class StudentHomeComponent implements OnInit {
  showAdd!: boolean;
  showUpdate!: boolean;

  students: StudentView[];

  selectedStudent: StudentView;
  selectedStudents: StudentView[] = [];
  selectedValue: string = 'No';

  enableDelete: boolean = false;

  displayAddStudent: boolean = false;

  displayStudentImage: boolean = false;
  imgSrc: string = '';

  displayStudentHeader: string = '';

  date: Date;
  maxDate: Date;

  teachers: Teacher[];
  selectedTeachers: Teacher[];

  ratings: Rating[];
  selectedRating: Rating[];

  studentForm: FormGroup;

  showAddStudentDialog() {
    this.displayAddStudent = true;
    this.displayStudentImage = false;
    this.showAdd = true;
    this.showUpdate = false;
    this.displayStudentHeader = 'Add Student';
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private studentService: StudentService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.ratings = [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
      { name: 'E' },
    ];
  }

  ngOnInit() {
    document.body.style.backgroundColor = 'white';

    this.initHeader();
    this.fetchTeachers();
    this.fetchData();

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    let nextMonth = month === 11 ? 0 : month;
    let nextYear = nextMonth === 0 ? year + 1 : year;

    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);

    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phone: [
        '',
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      teachers: [''],
      rating: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      specialization: ['', Validators.required],
      finishReview: ['', Validators.required],
    });
  }

  fetchTeachers() {
    this.studentService.getTeachers().subscribe((data) => {
      this.teachers = data;
    });
  }

  fetchData() {
    this.studentService.getStudents().subscribe((res) => {
      let tempStudent: StudentView[] = [];
      for (let i = 0; i < res.length; i++) {
        tempStudent.push({
          ...res[i],
          fullname: res[i].name.concat(' ', res[i].surname),
          age: this.ageCalculator(res[i].dateOfBirth),
          teachers: this.getTeacherByIds(res[i].teacherIDs),
        });
      }
      this.students = tempStudent;
    });
  }

  onSubmitNewStudent() {
    if (this.studentForm.valid) {
      let student: Student = {
        id: this.studentForm.value.length + 1,
        name: this.studentForm.value.name,
        surname: this.studentForm.value.surname,
        imgUrl: 'assets/student-4.jpg',
        dateOfBirth: this.datePipe.transform(
          this.studentForm.value.dateOfBirth,
          'yyyy-MM-dd'
        ),
        email: this.studentForm.value.email,
        phone: this.studentForm.value.phone,
        address: this.studentForm.value.address,
        teacherIDs: this.studentForm.value.teachers,
        specialization: this.studentForm.value.specialization,
        rating: this.studentForm.value.rating,
        finishReview: this.studentForm.value.finishReview,
      };
      this.studentService.postStudent(student).subscribe(
        (res) => {
          this.displayAddStudent = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Student Added Successfully',
            detail: student.name.concat(' ', student.surname),
          });
          this.studentForm.reset();
          this.fetchData();
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Something went wrong',
            detail: student.name.concat(' ', student.surname),
          });
          this.studentForm.reset();
        }
      );
    }
  }

  editStudent(student: StudentView) {
    this.selectedStudent = student;
    this.displayAddStudent = this.displayStudentImage = this.showUpdate = true;
    this.showAdd = false;
    this.imgSrc = student.imgUrl;
    this.displayStudentHeader = student.fullname;

    this.studentForm.patchValue({
      id: student.id,
      name: student.name,
      surname: student.surname,
      imgUrl: student.imgUrl,
      dateOfBirth: student.dateOfBirth,
      email: student.email,
      phone: student.phone,
      address: student.address,
      teachers: student.teacherIDs,
      specialization: student.specialization,
      rating: student.rating,
      finishReview: student.finishReview,
    });
  }

  updateStudent() {
    const formValue = this.studentForm.value;
    let student: Student = {
      id: this.selectedStudent.id,
      imgUrl: this.selectedStudent.imgUrl,
      name: formValue.name,
      surname: formValue.surname,
      dateOfBirth: this.datePipe.transform(formValue.dateOfBirth, 'yyyy-MM-dd'),
      email: formValue.email,
      phone: formValue.phone,
      address: formValue.address,
      teacherIDs: formValue.teachers,
      specialization: formValue.specialization,
      rating: formValue.rating,
      finishReview: formValue.finishReview,
    };
    this.studentService.updateStudent(student, student.id).subscribe(
      (res) => {
        this.displayAddStudent = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Student Updated Successfully',
          detail: student.name.concat(' ', student.surname),
        });
        this.studentForm.reset();
        this.fetchData();
      },
      (err) => {
        this.displayAddStudent = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: student.name.concat(' ', student.surname),
        });
        this.studentForm.reset();
      }
    );
  }

  cancelStudent() {
    this.displayAddStudent = false;
    this.studentForm.reset();
  }

  ageCalculator(dateOfBirth: string) {
    let age = 0;
    if (dateOfBirth) {
      const convertAge = new Date(dateOfBirth);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      return age;
    }
    return age;
  }

  getTeacherByIds(teacherIDs: string[]): string[] {
    let teachers1: string[] = [];
    for (let i = 0; i < teacherIDs.length; i++) {
      let teachersFound = this.teachers.find((t) => t.id == teacherIDs[i]);
      teachers1.push(teachersFound.name);
    }
    return teachers1;
  }

  initHeader() {
    this.dataService.setProfileVisibility(true);
  }

  enableDeletion(): void {
    if (this.selectedStudents.length > 0) {
      this.enableDelete = true;
    } else {
      this.enableDelete = false;
    }
  }

  deleteStudents() {
    let res = this.selectedStudents;
    for (let i = 0; i < res.length; i++) {
      this.studentService.deleteStudent(res[i].id).subscribe(() => {
        this.fetchData();
      });
    }
    this.messageService.add({
      severity: 'success',
      detail: res.length.toString(),
      summary: 'Student Record(s) Deleted',
    });
    this.selectedStudents = [];
    this.enableDeletion();
  }

  onRowSelect(event) {
    this.enableDeletion();
  }

  onRowUnselect(event) {
    this.enableDeletion();
  }
}
