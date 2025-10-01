import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  titleService = inject(Title)
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  this.titleService.setTitle('Contact Us - Uganda Medical Registry');
  }

}
