import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import {
  User,
  UserService,
  Category,
  CategoryService,
  City,
  CitiesService
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
  userImage: string;
  username: string;
  userInterests: Array<any>;
  photoChanged: Boolean;
  cities: Array<object>;
  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private citiesService: CitiesService,
    private fb: FormBuilder,
    private router: Router,
  ) { 
    this.editForm = this.fb.group(
      {
      'name': [ , Validators.required],
      'postal_code': [ , Validators.required],
      'building_number': [ , Validators.required],
      'street': [ , Validators.required],
      'region': [ , Validators.required],
      'city': [ , Validators.required],
      'phone': [, Validators.required]
    });
  }

  ngOnInit() {
    this.photoChanged = false;
    this.categories = [];
    this.currentUser = <User>{};
    this.userImage = "";
    this.userInterests = [];
    this.getCategories();
    this.loadCurrentUser();
    this.getCategories();
    this.getCities();
  }

  // load the current user's data
  loadCurrentUser() {
    this.userService.currentUser.subscribe(
      (userData: User) => {
        if(userData.name){
          this.currentUser = userData;
          this.userRole = this.currentUser.role;          
          this.userImage = `${environment.api_host}` + this.currentUser.profile_picture['url'];

          this.editForm.patchValue({
            name: this.currentUser.name,
          });
          if(this.currentUser.addresse) {
            this.editForm.patchValue({
              postal_code: this.currentUser.addresse['postal_code'],
              building_number: this.currentUser.addresse['building_number'],
              street: this.currentUser.addresse['street'],
              region: this.currentUser.addresse['region'],
              city: this.currentUser.addresse['city'],
            });
          }
          if(this.currentUser.phone) {
            this.editForm.patchValue({
              phone: this.currentUser.phone['phone'],
            });
          }
          if(this.userRole == 'Normal user'){
            for(let interest of this.currentUser.interests) {
              this.userInterests.push(interest['id']);
            }
            this.editForm.addControl('gender', new FormControl(this.currentUser.gender, Validators.required));
            this.editForm.addControl('interests', new FormControl(this.userInterests, Validators.required));
          }
        }
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

  // on image file change
  onFileChange(event) {

    if(!this.photoChanged)
      this.editForm.addControl('profile_picture', new FormControl('' ,));

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();  
      reader.onload = (event:any) => {
        this.userImage = event.target.result;
        this.photoChanged = true;
      }  
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  updateProfile() {

    if(this.photoChanged)
      this.editForm.get('profile_picture').setValue(this.userImage);

    this.userService.update(this.editForm.value, this.currentUser.id).subscribe(
      result => {
        alert('Profile updated successfully');
        this.router.navigateByUrl('/userprofile');
      },
      error => {
        console.log(error);
      }
    );
  }

  // get cities
  getCities() {
    this.citiesService.getCities().subscribe(
      result => {
        if(result['status'] == "SUCCESS") {
          this.cities = result['cities'];
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
