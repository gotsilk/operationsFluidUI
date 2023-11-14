import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DynamicDialogConfig} from 'primeng/dynamicdialog/dynamicdialog-config';
import {ValigatorModalComponent} from '../../modals/valigator-modal/valigator-modal.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DataSourceI} from '../../interfaces/commonInterfaces';
import {D_REGION} from '../../constants';
import {SuPropertiesService} from '../../services/su-properties.service';
import {DataSourceService} from '../../services/data-source.service';
import {ModalService} from '../../modals/modal.service';

@Component({
  selector: 'su-valigator-field',
  templateUrl: './valigator-field.component.html',
  styleUrls: ['./valigator-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ValigatorFieldComponent
    }
  ]
})
export class ValigatorFieldComponent implements OnInit, ControlValueAccessor {

  valiKey!: string;
  isDisabled: boolean;
  valUrl!: SafeResourceUrl|undefined;
  regEx: RegExp;
  unSafeUrlDisplay!: string;

  onTouched = () => {};
  onChange =  (model: any) => {};

  constructor(private suProperties: SuPropertiesService, private datasourceService: DataSourceService, private modals: ModalService,
              private sanitizer: DomSanitizer) {
    this.isDisabled = false;
    this.regEx = new RegExp(this.suProperties.getProperty('datasource.regex.matcher'), 'gi');
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.valiKey = obj;
    if (!this.valUrl) {
      this.valUrl = this.getDatasourceEnvironmentValigatorRule();
    }
  }


  openValigatorModal(): void{

    const config: DynamicDialogConfig = {
      data: {
        url: this.valUrl
      },
      width: '90%',
      height: '90%',
      closeOnEscape: true,
      // @ts-ignore
      header: `URL: ${this.unSafeUrlDisplay}`

    };
    this.modals.openDynamicModal(ValigatorModalComponent, config);
  }

  getDatasourceEnvironmentValigatorRule(): SafeResourceUrl|undefined{
    let m;
    let region;
    let santizedValiRuleUrl;
    let valiServerUrl;
    const datasource: DataSourceI|null = this.datasourceService.getLastRecordedDataSource();
    if (datasource){
      // tslint:disable-next-line:no-conditional-assignment
      while ((m = this.regEx.exec(datasource.name)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === this.regEx.lastIndex) {
          this.regEx.lastIndex++;
        }
        region = m[3].toLowerCase();
      }

      switch (region) {
        case D_REGION.DEV :
        case D_REGION.QA :
          valiServerUrl = this.suProperties.getProperty(region + '.valigator.url');
          break;
        default:
          valiServerUrl = this.suProperties.getProperty(region + '.valigator.url');
      }
    }


    if (this.valiKey){
      const valiRuleUrl = `${valiServerUrl}/set/${this.valiKey}`;
      this.unSafeUrlDisplay = valiRuleUrl;
      santizedValiRuleUrl = this.sanitizer.bypassSecurityTrustResourceUrl(valiRuleUrl);
    }
    return santizedValiRuleUrl;
  }
}
