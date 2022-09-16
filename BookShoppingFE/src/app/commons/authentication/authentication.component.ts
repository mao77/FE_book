import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import redirect from '../../contants/redirect';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../services/common.service';
import {AuthenService} from '../../services/authen.service';
import {TokenStorageService} from '../../services/token-storage.service';
import {UserService} from '../../user/service/user.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  formLogin: FormGroup;
  formRegister: FormGroup;
  otp: string;

  @Input() typeForm: string;

  @Output() newItemEvent = new EventEmitter<string>();

  constructor(private el: ElementRef, private fb: FormBuilder, private toastrService: ToastrService,
              private commonService: CommonService, private authenService: AuthenService,
              private tokenStorageService: TokenStorageService, private userService: UserService) {

    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });

    this.formRegister = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100),
        Validators.pattern('^([a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ ]+)*$')]],
      email: ['', [Validators.required, Validators.email]],
      OTP: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]],
      pwGroup: this.fb.group({
        newPass: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
        confirmPass: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
      }, this.comparePass)
    });
  }

  validationMessages = {
    name: [
      {type: 'required', message: 'Họ và tên không được để trống.'},
      {type: 'maxlength', message: 'Họ và tên không quá 100 kí tự.'},
      {type: 'pattern', message: 'Họ và tên không chứa kí tự đặc biệt.'}
    ],
    email: [
      {type: 'required', message: 'Email không được để trống.'},
      {type: 'email', message: 'Email không đúng định dạng.'}
    ],
    password: [
      {type: 'required', message: 'Mật khẩu không được để trống.'},
      {type: 'minlength', message: 'Mật khẩu dài từ 8-32 kí tự.'},
      {type: 'maxlength', message: 'Mật khẩu dài từ 8-32 kí tự.'}
    ],
    newPass: [
      {type: 'required', message: 'Mật khẩu không được để trống.'},
      {type: 'minlength', message: 'Mật khẩu dài từ 8-32 kí tự.'},
      {type: 'maxlength', message: 'Mật khẩu dài từ 8-32 kí tự.'}
    ],
    confirmPass: [
      {type: 'required', message: 'Mật khẩu không được để trống.'},
      {type: 'minlength', message: 'Mật khẩu dài từ 8-32 kí tự.'},
      {type: 'maxlength', message: 'Mật khẩu dài từ 8-32 kí tự.'}
    ],
    OTP: [
      {type: 'required', message: 'OTP không được để trống.'},
      {type: 'min', message: 'OTP phải chứa 6 kí tự số'},
      {type: 'max', message: 'OTP phải chứa 6 kí tự số'}
    ]
  };

  ngOnInit(): void {
    if (this.typeForm === 'login') {
      this.openFormLogin();
    } else {
      this.openFormRegister();
    }
  }

  get emailLogin() {
    return this.formLogin.get('email');
  }

  get emailRegister() {
    return this.formRegister.get('email');
  }

  get password() {
    return this.formLogin.get('password');
  }

  get OTP() {
    return this.formRegister.get('OTP');
  }

  get name() {
    return this.formRegister.get('name');
  }

  get newPass() {
    return this.formRegister.get('pwGroup').get('newPass');
  }

  get confirmPass() {
    return this.formRegister.get('pwGroup').get('confirmPass');
  }

  comparePass(c: AbstractControl) {
    const v = c.value;
    if (v.newPass === v.confirmPass) {
      return null;
    }
    return {passwordNotMatch: true};
  }

  openFormLogin() {
    this.el.nativeElement.querySelector('.modal').style.display = 'block';
    this.el.nativeElement.querySelector('.form-login').style.display = 'block';
    this.el.nativeElement.querySelector('.form-register').style.display = 'none';
    this.el.nativeElement.querySelectorAll('.modal-header > li')[0].classList.add('modal-header-first-select');
    this.el.nativeElement.querySelectorAll('.modal-header > li')[1].classList.remove('modal-header-last-select');
  }

  openFormRegister() {
    this.el.nativeElement.querySelector('.modal').style.display = 'block';
    this.el.nativeElement.querySelector('.form-login').style.display = 'none';
    this.el.nativeElement.querySelector('.form-register').style.display = 'block';
    this.el.nativeElement.querySelectorAll('.modal-header > li')[0].classList.remove('modal-header-first-select');
    this.el.nativeElement.querySelectorAll('.modal-header > li')[1].classList.add('modal-header-last-select');
  }

  hiddenFormAuthen() {
    this.newItemEvent.emit();
    this.el.nativeElement.querySelector('.modal').style.display = 'none';
  }

  loginOAuth2Google() {
    window.location.href = redirect('google');
  }

  loginOAuth2Facebook() {
    window.location.href = redirect('facebook');
  }

  getOTP() {
    if (this.emailRegister.valid) {
      this.el.nativeElement.querySelector('.loading-container').style.display = 'block';
      this.commonService.getOtpRegister(this.emailRegister.value).subscribe(
        data => {
          this.el.nativeElement.querySelector('.loading-container').style.display = 'none';
          this.toastrService.success('Vui lòng kiểm tra email để lấy mã OTP', 'Thông báo');
        },
        error => {
          this.el.nativeElement.querySelector('.loading-container').style.display = 'none';
          this.toastrService.error(error.error.message, 'Thông báo');
        }
      );
    } else {
      this.toastrService.warning('Email của bạn không hợp lệ !!!', 'Thông báo');
    }
  }

  login() {
    if (this.formLogin.valid) {
      this.authenService.login(this.formLogin.value).subscribe(
        data => {
          this.tokenStorageService.saveToken(data.message);
          console.log(data);
          this.userService.getInfo(data.message).subscribe(
              user => {
                this.tokenStorageService.saveUser(user);
                this.tokenStorageService.isLogin();
                window.location.href = 'http://localhost:4200';
              },
              error => {
                alert(error);
              }
            );
        },
        error => {
          this.toastrService.error(error.error.message, 'Thông báo');
        }
      );
    }
  }

  register() {
    if (this.formRegister.valid) {
      console.log(this.formRegister.value);
      const registerRequest = {
        email: this.emailRegister.value,
        name: this.name.value,
        otp: Number(this.OTP.value),
        newPass: this.newPass.value,
        confirmPass: this.confirmPass.value
      };
      this.authenService.register(registerRequest).subscribe(
        data => {
          this.toastrService.success(data.message, 'Thông báo');
          this.openFormLogin();
        },
        error => {
          this.toastrService.error(error.error.message, 'Thông báo');
        });
    }
  }

  togglePassword(idInput: string, idToggle: string) {
    const input = this.el.nativeElement.querySelector(idInput);
    const toggle = this.el.nativeElement.querySelector(idToggle);
    const typeInput = input.type === 'text' ? 'password' : 'text';
    input.setAttribute('type', typeInput);
    toggle.classList.toggle('bi-eye-slash');
    toggle.classList.toggle('bi-eye');
  }
}
