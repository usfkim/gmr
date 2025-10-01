import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-media-kit',
  templateUrl: './media-kit.component.html',
  styleUrls: ['./media-kit.component.css']
})
export class MediaKitComponent implements OnInit {
  titleService = inject(Title);
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('Media Kit - Uganda Medical Registry');
  }
}