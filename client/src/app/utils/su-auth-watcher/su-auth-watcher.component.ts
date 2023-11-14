import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {RoutingChangeService} from '../../services/routing-change.service';

@Component({
  selector: 'app-su-auth-watcher',
  templateUrl: './su-auth-watcher.component.html',
  styleUrls: ['./su-auth-watcher.component.scss']
})
export class SuAuthWatcherComponent implements OnInit {

  constructor(private service: CommonService, public routerService: RoutingChangeService) {
    this.authorized = false;
    this.detailView = true;
  }

  authorized;
  @Input()mode!: string;
  detailView;

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.service.$canEdit.subscribe((res => {
        this.authorized = res;
      }));
    }else {
      this.service.$canView.subscribe((res => {
        this.authorized = res;
      }));
    }

    this.routerService.$detailsView.subscribe((detailView => {
      this.detailView = detailView;
    }));

  }
}
