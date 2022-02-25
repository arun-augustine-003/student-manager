import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IStudent } from '../core/interfaces/index';
import { IStudentView } from '../core/interfaces/index';
import { ITeacher } from '../core/interfaces/index';
import { IRating } from '../core/interfaces/index';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StudentService } from '../core/service/studentService';
import { DataService } from '../core/service/data.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class StudentHomeComponent implements OnInit {
  displayAdd!: boolean;
  displayUpdate!: boolean;
  displayDelete: boolean = false;
  displayStudentModal: boolean = false;
  displayStudentImage: boolean = false;

  imgSrc: string = '';
  displayStudentHeader: string = '';

  maxDate: Date;

  studentForm: FormGroup;

  students: IStudentView[];
  teachers: ITeacher[];
  ratings: IRating[];

  selectedStudent: IStudentView;
  selectedStudents: IStudentView[] = [];

  submitButtonTitle: string = 'Add Student';

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
    let arr = document.body.classList;
  }
  ngOnInit() {
    this.initHeader();
    this.fetchTeachers();
    this.fetchData();
    this.maxDate = new Date();
    this.initStudentForm();
  }

  initHeader() {
    this.dataService.setProfileVisibility(true);
  }

  fetchTeachers() {
    this.studentService.getTeachers().subscribe((data) => {
      this.teachers = data;
    });
  }

  fetchData() {
    this.studentService.getStudents().subscribe((res) => {
      let tempStudent: IStudentView[] = [];
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

  initStudentForm() {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phone: [
        '',
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      teachers: ['', Validators.required],
      rating: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      specialization: ['', Validators.required],
      finishReview: ['', Validators.required],
    });
  }

  onSubmitForm() {
    if (!!this.selectedStudent) this.onUpdateStudent();
    else this.onAddStudent();
  }

  onAddStudent() {
    if (this.studentForm.valid) {
      let student: IStudent = {
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
      this.studentService.addStudent(student).subscribe(
        (res) => {
          this.displayStudentModal = false;
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

  onClickStudent(student: IStudentView) {
    this.selectedStudent = student;
    this.displayStudentModal = this.displayStudentImage = true;
    this.submitButtonTitle = 'Save';
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

  onUpdateStudent() {
    const formValue = this.studentForm.value;
    let student: IStudent = {
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
    this.studentService.updateStudent(student).subscribe(
      (res) => {
        this.displayStudentModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Student Updated Successfully',
          detail: student.name.concat(' ', student.surname),
        });
        this.studentForm.reset();
        this.selectedStudent = null;
        this.fetchData();
      },
      (err) => {
        this.displayStudentModal = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: student.name.concat(' ', student.surname),
        });
        this.studentForm.reset();
      }
    );
  }

  onDeleteStudents() {
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

  enableDeletion(): void {
    if (this.selectedStudents.length > 0) {
      this.displayDelete = true;
    } else {
      this.displayDelete = false;
    }
  }

  cancelStudent() {
    this.displayStudentModal = false;
    this.studentForm.reset();
  }

  displayAddStudentModal() {
    this.displayStudentModal = true;
    this.displayStudentImage = false;
    this.submitButtonTitle = 'Add Student';
    this.displayStudentHeader = 'Add Student';
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
    let teachersList: string[] = [];
    for (let i = 0; i < teacherIDs.length; i++) {
      let teachersFound = this.teachers.find((t) => t.id == teacherIDs[i]);
      teachersList.push(teachersFound.name);
    }
    return teachersList;
  }
}
