import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // List of hero images located in the `public/` folder
  heroImages: string[] = [
    '/hero1.jpg',
    '/hero2.jpg',
    '/hero3.jpg',
    '/hero4.jpg',
    '/hero5.jpg',
  ];

  currentIndex = 0;
  intervalId: any = null;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.startSlideshow();
  }

  startSlideshow() {
    // rotate every 5 seconds
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.heroImages.length;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Helper used by template to check active image
  isActive(index: number) {
    return index === this.currentIndex;
  }

}
