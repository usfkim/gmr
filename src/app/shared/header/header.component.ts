import { Component, HostBinding, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  showMenu = false;
  currentPalette = 'palette-a';
  darkMode = false;
  
  private lastScroll = 0;
  private onScroll = () => this.handleScroll();

  @HostBinding('class.header-hidden') hidden = false;

  ngOnInit(){
    window.addEventListener('scroll', this.onScroll, { passive: true });
    // Prevent body scroll when mobile menu is open
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    // load theme from storage
    try {
      const p = localStorage.getItem('umr:palette');
      const d = localStorage.getItem('umr:dark');
      if (p) { this.applyPalette(p); }
      if (d === '1' || d === 'true') { 
        this.setDark(true); 
      } else if (d === '0' || d === 'false') {
        this.setDark(false);
      } else {
        // Check system preference if no stored preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDark(prefersDark);
      }
    } catch (e) { /* ignore */ }
  }

  ngAfterViewInit(){
    // Initialize any additional setup if needed
  }

  ngOnDestroy(){
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  toggle() {
    this.showMenu = !this.showMenu;
    // Prevent body scroll when menu is open
    if (this.showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  private handleOutsideClick(event: Event) {
    // Close mobile menu when clicking outside
    if (this.showMenu) {
      const target = event.target as HTMLElement;
      const mobileMenu = document.querySelector('.mobile-menu');
      const menuButton = document.querySelector('.mobile-menu-button');
      
      if (mobileMenu && !mobileMenu.contains(target) && !menuButton?.contains(target)) {
        this.showMenu = false;
        document.body.style.overflow = '';
      }
    }
  }

  applyPalette(name: string){
    this.currentPalette = name || 'palette-a';
    // remove other palette classes and add selected to documentElement
    const el = document.documentElement;
    el.classList.remove('palette-a','palette-b','palette-c');
    el.classList.add(this.currentPalette);
    try { localStorage.setItem('umr:palette', this.currentPalette); } catch(e){}
  }

  setDark(on: boolean){
    this.darkMode = !!on;
    const el = document.documentElement;
    if (this.darkMode) { 
      el.classList.add('dark-mode'); 
      try { localStorage.setItem('umr:dark','true'); } catch(e) {}
    } else { 
      el.classList.remove('dark-mode'); 
      try { localStorage.setItem('umr:dark','false'); } catch(e) {}
    }
  }

  toggleDark(){
    this.setDark(!this.darkMode);
  }

  private handleScroll(){
    const current = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only hide header on mobile when scrolling down
    if (window.innerWidth <= 768) {
      if (current > this.lastScroll && current > 100) {
        // scrolling down -> hide header
        this.hidden = true;
      } else {
        // scrolling up -> show header
        this.hidden = false;
      }
    } else {
      // Always show header on desktop
      this.hidden = false;
    }
    
    this.lastScroll = current <= 0 ? 0 : current; // For Mobile or negative scrolling
  }
}