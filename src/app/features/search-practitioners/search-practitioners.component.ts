import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search-practitioners',
  templateUrl: './search-practitioners.component.html',
  styleUrl: './search-practitioners.component.css'
})
export class SearchPractitionersComponent implements OnInit {
  titleService = inject(Title);
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  this.titleService.setTitle('Search Practitioners - Uganda Medical Registry');
  }
}
