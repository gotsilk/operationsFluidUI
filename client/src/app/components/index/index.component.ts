import {Component} from '@angular/core';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {

  constructor(private service: CommonService) {
    this.service.showCreateMenu(false);
  }
}
