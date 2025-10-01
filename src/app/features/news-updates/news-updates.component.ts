import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-news-updates',
  templateUrl: './news-updates.component.html',
  styleUrl: './news-updates.component.css'
})
export class NewsUpdatesComponent implements OnInit {

  titleService = inject(Title);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  this.titleService.setTitle('News & Updates - Uganda Medical Registry');
  }

}
