import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router} from '@angular/router';
import {SuMessageService} from './services/su-message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  now: Date;
  navInitComplete!: boolean;

  constructor(public router: Router, public suMessage: SuMessageService) {
    this.now = new Date();
  }

  @ViewChild('rootLevelContainer') rootLevelContainer!: ElementRef;
  @ViewChild('footer') footer!: ElementRef;

  ngOnInit(): void {
    this.returnToState();
  }

  async returnToState(): Promise<any>{
    const state: any = JSON.parse(localStorage.getItem('SU_OPERS_STATE') as string);
    if (state) {
      localStorage.removeItem('SU_OPERS_STATE');
      const now = new Date().getTime() - 60000 * 4; // 5 min from ms * 4
      if (now <= state.timestamp) {
        const url = state.state;
        await this.router.navigate([url]);
      }
    }
  }
}
