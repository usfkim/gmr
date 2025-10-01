import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}
  
  passwordVisible = false;
  loginError = '';
  isLoading = false;

  showPassword() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  // Mock user credentials for testing
  mockUsers = [
    {
      email: 'dr.yusuf@mulago.go.ug',
      password: 'password123',
      name: 'Dr. Yusuf AbdulHakim Addo',
      role: 'practitioner',
      specialty: 'Cardiology'
    },
    {
      email: 'dr.sarah@mulago.go.ug', 
      password: 'password123',
      name: 'Dr. Sarah Nakato',
      role: 'practitioner',
      specialty: 'Pediatrics'
    },
    {
      email: 'admin@umr.go.ug',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      specialty: 'Administration'
    },
    {
      email: 'test@test.com',
      password: 'test123',
      name: 'Test User',
      role: 'practitioner',
      specialty: 'General Medicine'
    }
  ];

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.loginError = '';
      
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      
      // Simulate API call delay
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Store user data in localStorage (in production, use proper auth service)
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
          
          // Redirect based on user role
          if (user.role === 'admin') {
            this.router.navigate(['/government']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.loginError = 'Invalid email or password. Please try again.';
        }
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.loginError = 'Please fill in all required fields.';
    }
  }

  // Quick login methods for testing
  quickLogin(userType: string) {
    let user;
    switch(userType) {
      case 'doctor':
        user = this.mockUsers[0]; // Dr. Yusuf
        break;
      case 'pediatrician':
        user = this.mockUsers[1]; // Dr. Sarah
        break;
      case 'admin':
        user = this.mockUsers[2]; // Admin
        break;
      default:
        user = this.mockUsers[3]; // Test user
    }
    
    this.form.patchValue({
      email: user.email,
      password: user.password
    });
    
    this.onSubmit();
  }
}
