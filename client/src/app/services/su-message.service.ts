import { Injectable } from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SuMessageService {

  constructor(public message: MessageService) { }

  addInfo(header: string, details: string): void {
    this.message.add({key: 'rootToast', severity: 'info', summary: header, detail: details});
  }
  addWarn(header: string, details: string): void {
    this.message.add({key: 'rootToast', severity: 'warn', summary: header, detail: details});
  }
  addError(header: string, details: string): void {
    this.message.add({key: 'rootToast', severity: 'error', summary: header, detail: details, life: 10000});
  }

  addSuccess(header: string, details: string): void {
    this.message.add({key: 'rootToast', severity: 'success', summary: header, detail: details});
  }

  clearAll(): void {
    this.message.clear('rootToast');
  }
}
