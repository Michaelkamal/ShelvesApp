import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import {
  User,
  UserService,
  Category,
  CategoryService
} from '../../shared';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  currentUser: User;
  userRole: string;
  editForm: FormGroup;
  categories: Array<Category>;
  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.editForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'name': ['', Validators.required],
      'profile_picture': ['', Validators.required]
    });
    this.loadCurrentUser();
    this.getCategories();
  }

  // load the current user's data
  loadCurrentUser() {
    this.userService.currentUser.subscribe(
      (userData: User) => {
        if(userData.name){
          this.currentUser = userData;
          this.userRole = this.currentUser.role;
          if(this.userRole == 'Normal user'){
            this.editForm.addControl('gender', new FormControl('',Validators.required));
          }
        }
      }
    );  
  }

  // update user 
  updateUser() {
    this.userService.update(this.editForm.value).subscribe(
      result => {
        this.currentUser = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  // get categories
  getCategories() {
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result['data'];
      },
      error => {
        console.log(error);
      }
    );
  }
}
