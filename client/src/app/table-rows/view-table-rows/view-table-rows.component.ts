import {Component, OnInit} from '@angular/core';
import {FilterMatchMode, FilterService} from 'primeng/api';
import {ColumnStructureI} from '../../interfaces/commonInterfaces';
import {DatePipe} from '@angular/common';
import { ViewChild } from '@angular/core';
import {Table} from 'primeng/table';


@Component({
  selector: 'app-view-table-rows',
  templateUrl: './view-table-rows.component.html',
  styleUrls: ['./view-table-rows.component.scss']
})
export class ViewTableRowsComponent implements OnInit {


  init: boolean;
  headerCols!: any[];
  rows: any;
  paginationSizes = [10, 25, 50, 100, 500];
  suTextPrimeNgFilter = 'customPrimeNgFilter';
  selectedCols!: any[];
  matchModeOptions: any[];
  allColumns: PrimeNgHeaderI[];
  startingColSize = 9;
  selectedRecords!: any[];


  @ViewChild('dt') dt!: Table;

  constructor(public filterService: FilterService) {
    this.init = false;
    this.allColumns = [];
    this.getCommaSepWildCardFilter();
    this.selectedRecords = [];

    this.matchModeOptions = [
      { label: 'SU Custom Equals', value: this.suTextPrimeNgFilter },
      { label: 'Contains', value: FilterMatchMode.CONTAINS },
      { label: 'IN', value: FilterMatchMode.IN }
      ];
  }

  async ngOnInit(): Promise<void> {
    const allCols: ColumnStructureI[] = await this.getStruct();
    this.headerCols = this.setColumns();
    this.selectedCols = this.headerCols;
    this.init = true;
  }

  setColumns(): any[] {
    const formattedCols: any[] = [];
    const max = 10;
    let ii = 0;
    let i;
    this.getStruct().forEach((item) => {
      if (ii < max){
        i = {
          field: item.columnName,
          display: item.columnName,
          isHidden: false
        };
        formattedCols.push(i);
        ii++;
      }
    });
    return formattedCols;
  }


  getStruct(): ColumnStructureI[] {
    return [
          {
            columnName: 'fareStarProfile',
            columnType: 'string',
            constraints: {
              nullable: 'false',
              maxsize: '16'
            },
            isId: true
          },
          {
            columnName: 'displayEligibleStops',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'carriers',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              matches: '([0-9A-Z]{2}|\\*)(,([0-9A-Z]{2}|\\*)){0,1000}'
            },
            isId: false
          },
          {
            columnName: 'pricingJobId',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'pricingType',
            columnType: 'number',
            constraints: {
              nullable: 'false',
              inlist: '[0, 1, 2, 3, 4]'
            },
            isId: false
          },
          {
            columnName: 'displayAllDuration',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'ticketingCarrier',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              matches: '(\\s?[A-Z0-9*]{1,2},?\\s?)*',
              maxsize: '2'
            },
            isId: false
          },
          {
            columnName: 'displayEligibleAirlineLogo',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayEligibleFlightTimes',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayAllAirlineName',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'commissionPercentage',
            columnType: 'number',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'pricingForcePassengerType',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'shoppingGds',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'filedType',
            columnType: 'number',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'proofTypes',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'accountCode',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              maxsize: '16'
            },
            isId: false
          },
          {
            columnName: 'displayAllFlightTimes',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'pricingTiersInclude',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'employeeNumber',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'fareAdvancePurchaseDaysMax',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'validationRequired',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'fareDops',
            columnType: 'set',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'bookingGds',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'rulesString',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'fareIssueDateBeg',
            columnType: 'date',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'suCancelFee',
            columnType: 'number',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'airlineMorNet',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'cosUpsellOverride',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayLoggedinAirlineName',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'fareIssueDateEnd',
            columnType: 'date',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'buildPhase4',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayAllStops',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayAllAirlineLogo',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'setTicketManualHold',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'phase4Type',
            columnType: 'number',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'ticketDesignator',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              matches: 'A-Z0-9',
              maxsize: '20'
            },
            isId: false
          },
          {
            columnName: 'displayLoggedinDuration',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'fareSuppressed',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'serviceFee',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'tourCode',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'displayLoggedinAirlineLogo',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'requireAvsZip',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'allowAddonCodeshares',
            columnType: 'boolean',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'contractApr',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'excludeDynamic',
            columnType: 'boolean',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'displayLoggedinStops',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'pricingTiersExclude',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'airlineMorCommission',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'serviceFeeCurrencyCode',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              matches: '[A-Z]{0,3}'
            },
            isId: false
          },
          {
            columnName: 'currencyConversion',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              maxsize: '16'
            },
            isId: false
          },
          {
            columnName: 'splitPricingJobId',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'morRate',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'displayEligibleAirports',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayAllAirports',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'fareAdvancePurchaseDaysMin',
            columnType: 'number',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'requireAvsAddress',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'ticketTypeId',
            columnType: 'number',
            constraints: {
              nullable: 'false',
              inlist: '[1, 2, 3]'
            },
            isId: false
          },
          {
            columnName: 'ticketingJobId',
            columnType: 'number',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'searchGroup',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              maxsize: '50'
            },
            isId: false
          },
          {
            columnName: 'displayEligibleAirlineName',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayLoggedinFlightTimes',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'chargeThruArc',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'osiMessage',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'eligibleAgentOnly',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'displayLoggedinAirports',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'requireCvv',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'pricingPlusUp',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          },
          {
            columnName: 'alternateStars',
            columnType: 'string',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'lastTktDate',
            columnType: 'date',
            constraints: {
              nullable: 'true'
            },
            isId: false
          },
          {
            columnName: 'endorsements',
            columnType: 'string',
            constraints: {
              nullable: 'true',
              maxsize: '47'
            },
            isId: false
          },
          {
            columnName: 'displayEligibleDuration',
            columnType: 'boolean',
            constraints: {
              nullable: 'false'
            },
            isId: false
          }
    ];
  }

  getCommaSepWildCardFilter(): any {
    // value is the column value, filter is textbox value
    this.filterService.register(this.suTextPrimeNgFilter, (value: any, filter: any): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      filter = filter.toString();
      const array: any = filter.toUpperCase().replace(/\s/g, '').split(',');
      return array.find((item: any) => {
        item = item.toString();
        return value.toUpperCase().includes(item);
      });

      // return array.indexOf(value.toString()) >= 0;
    });
  }

  displayData(data: any): any {
    // for arrays
    if (data instanceof Array){
      let items = ' ';
      data.forEach((item) => {
        if (item.id){
          items += `${item.id.toString()} `;
        }else {
          items += `${item.toString()}| `;
        }

      });
      return items;
    }


    if (data){
      // for Fks
      if (data.id){
        return data.id;
      }
      // try to parse a data here
      try{
        const date =  new Date(data);
        if (!isNaN(date.getDate())){
          const datePipe = new DatePipe('en-US');
          return datePipe.transform(date, 'shortDate');
        }
      }catch (e){
        // eat it bitch
      }
    }
    return data;
  }

  navigate(event: any): void{
    // event.data is the row data
    console.log('clicked');
  }

  remove(): void{
    this.headerCols.pop();
  }

}
export interface PrimeNgHeaderI {
  isHidden: boolean;
  display: string;
  field: string;
}

