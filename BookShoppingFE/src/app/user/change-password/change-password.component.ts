import {Component, ElementRef, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {CommonService} from '../../services/common.service';
import {TokenStorageService} from '../../services/token-storage.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  formPw: FormGroup;
  formSubmitted = false;
  validationMessages = {
    otp: [
      {type: 'required', message: 'Mã OTP phải chứa 6 kí tự số'},
      {type: 'pattern', message: 'Mã OTP phải chứa 6 kí tự số'}
    ],
    password: [
      {type: 'required', message: 'Mật khẩu không được để trống'},
      {type: 'minlength', message: 'Mật khẩu phải từ 8-32 kí tự'},
      {type: 'maxlength', message: 'Mật khẩu phải từ 8-32 kí tự'}
    ]
  };

  constructor(private userService: UserService, private el: ElementRef, private commonService: CommonService,
              private storageService: TokenStorageService, private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.formPw = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.pattern('^\\d{6}$')]),
      oldPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
      pwGroup: new FormGroup({
        newPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
        confirmPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)])
      }, this.comparePass)
    });
  }

  get pwGroup() {
    return this.formPw.get('pwGroup');
  }

  get otp() {
    return this.formPw.get('otp');
  }

  get oldPass() {
    return this.formPw.get('oldPass');
  }

  get newPass() {
    return this.formPw.get('pwGroup').get('newPass');
  }

  get confirmPass() {
    return this.formPw.get('pwGroup').get('confirmPass');
  }

  comparePass(c: AbstractControl) {
    return c.value.newPass === c.value.confirmPass ? null : {passwordNotMatch: true};
  }

  togglePassword(idInput: string, idToggle: string) {
    const input = this.el.nativeElement.querySelector(idInput);
    const toggle = this.el.nativeElement.querySelector(idToggle);
    const typeInput = input.type === 'text' ? 'password' : 'text';
    input.setAttribute('type', typeInput);
    toggle.classList.toggle('bi-eye-slash');
    toggle.classList.toggle('bi-eye');
  }

  changePass() {
    if (this.formPw.valid) {
      this.userService.updatePassword(this.storageService.getUser().id,
        this.oldPass.value, this.newPass.value, Number(this.otp.value)).subscribe(
          next => {
            this.toastrService.success(next.message, 'Thông báo');
            this.formSubmitted = false;
            this.formPw.reset();
          },
        error => {
          this.toastrService.error(error.error.message, 'Thông báo');
          this.formSubmitted = false;
        }
      );
    } else {
      this.formSubmitted = true;
      this.toastrService.warning('Thông tin trong form không hợp lệ !!!', 'Thông báo');
    }
    console.log(this.formPw);
  }

  getOtp() {
    this.el.nativeElement.querySelector('.loading-container').style.display = 'block';
    this.commonService.getOtp(this.storageService.getUser().email).subscribe(
      data => {
        this.el.nativeElement.querySelector('.loading-container').style.display = 'none';
        this.toastrService.success('Vui lòng kiểm tra email để lấy mã OTP', 'Thông báo');
      },
      error => {
        this.el.nativeElement.querySelector('.loading-container').style.display = 'none';
        this.toastrService.error(error.error.message, 'Thông báo');
      }
    );
  }
}

