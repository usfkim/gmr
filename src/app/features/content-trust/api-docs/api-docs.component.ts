import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-api-docs',
  templateUrl: './api-docs.component.html',
  styleUrls: ['./api-docs.component.css']
})
export class ApiDocsComponent implements OnInit {
  titleService = inject(Title);
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('API Documentation - Uganda Medical Registry');
  }
}