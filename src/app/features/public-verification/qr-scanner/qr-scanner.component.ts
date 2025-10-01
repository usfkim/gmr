import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {
  titleService = inject(Title);
  
  scanResult: any = null;
  isScanning = false;
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('QR Scanner - Public Verification');
  }

  startScan(): void {
    this.isScanning = true;
    // Simulate QR scan
    setTimeout(() => {
      this.scanResult = {
        practitioner: {
          name: 'Dr. Yusuf AbdulHakim Addo',
          profession: 'Medical Doctor',
          specialty: 'Cardiology',
          facility: 'Mulago National Referral Hospital',
          licenseNumber: 'UMC-UG-2458',
          status: 'verified'
        }
      };
      this.isScanning = false;
    }, 2000);
  }

  clearResults(): void {
    this.scanResult = null;
  }
}