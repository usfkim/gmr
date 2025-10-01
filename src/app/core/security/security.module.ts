import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityRoutingModule } from './security-routing.module';
import { MfaChallengeComponent } from './components/mfa-challenge/mfa-challenge.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { BlockchainService } from './services/blockchain.service';
import { EncryptionService } from './services/encryption.service';
import { AuditLogService } from './services/audit-log.service';
import { DlpService } from './services/dlp.service';
import { MfaService } from './services/mfa.service';
import { DataResidencyService } from './services/data-residency.service';
import { BackupService } from './services/backup.service';

@NgModule({
  declarations: [
    MfaChallengeComponent,
    AccessDeniedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SecurityRoutingModule
  ],
  providers: [
    BlockchainService,
    EncryptionService,
    AuditLogService,
    DlpService,
    MfaService,
    DataResidencyService,
    BackupService
  ]
})
export class SecurityModule { }