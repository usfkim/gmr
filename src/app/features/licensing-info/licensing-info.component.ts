import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-licensing-info',
  templateUrl: './licensing-info.component.html',
  styleUrl: './licensing-info.component.css'
})
export class LicensingInfoComponent implements OnInit {
  titleService = inject(Title);

  tabs = [
    { label: 'Medical Doctors', value: 'doctors' },
    { label: 'Nurses & Midwives', value: 'nurses' },
    { label: 'Allied Health Professionals', value: 'allied' },
    { label: 'Traditional Medicine Practitioners', value: 'traditional' }
  ];

  selectedTab = 'doctors';

  selectTab(tabValue: string): void {
    this.selectedTab = tabValue;
  }

  active: number | null = null;

  toggle(index: number) {
    this.active = this.active === index ? null : index;
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  this.titleService.setTitle('Medical Licensing in Uganda - Uganda Medical Registry')
  }

}
