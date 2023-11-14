import {TableGroups} from './TableGroups';
import {TableI} from './interfaces/commonInterfaces';

export const CATEGORY1: TableI[] = [
  // todo simplify get rid of objKeyStore, name, label, idCol name default to id
  {
    name: 'TestingDomain1',
    icon: 'pi pi-fw pi-fact_check',
    group: TableGroups.GROUP5,
    idColName: 'id',
    univ: true,
  }
];

export const CATEGORY2: TableI[] = [
  {
    name: 'TestingDomain2',
    icon: 'pi pi-fw pi-home',
    idColName: 'id',
    group: TableGroups.PRODUCT,
    univ: true
  }

];

export const CATEGORY3: TableI[] = [
  {
    group: TableGroups.GROUP4,
    name: 'ErrorStatus',
    icon: 'pi pi-fw pi-home',
    idColName: 'id',
    univ: true
  }

];
