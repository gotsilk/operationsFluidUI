import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EditMode} from '../../constants';

@Component({
  selector: 'su-fk-pointer',
  templateUrl: './fk-pointer.component.html',
  styleUrls: ['./fk-pointer.component.scss']
})
export class FkPointerComponent implements OnInit {

  tableDetails: any;

  @Input() rowIds!: any[];
  @Input() tableName!: string;
  init: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.init = false;
  }

  async goToRow(id: any): Promise<boolean>{
    const url = `./../../${this.tableName}/details`;
    return await this.router.navigate([url], {
      relativeTo: this.route,
      queryParams: {
        id,
        mode: EditMode.EDIT
      }
    });
  }

  ngOnInit(): void {
    // inputs should be populated by now
    if (this.rowIds.length >= 0){
      if (!isNaN(this.rowIds[0])) {
        this.rowIds = this.rowIds.sort((n1, n2) => n1 - n2);
      }else {
        this.rowIds.sort((a, b) => a.localeCompare(b));
      }
    }
    this.init = true;
  }
}
