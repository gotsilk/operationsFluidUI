
export enum DataSourceNames {
  DATA_SOURCE_FARE = 'dbmFareDataSource',
  DATA_SOURCE_MEMBER = 'dbmMemberDataSource',
  DATA_SOURCE_STATS = 'dbmStatsDataSource',
  DATA_SOURCE_ERROR = 'dbmErrorDataSource',
}

export const SessionStorageKeys = {
  LAST_RECORDED_DATA_SOURCE: 'SU_LAST_DATA_SOURCE'
};


export enum suDbRoutes  {
  FARE = 'fare',
  MEMBER = 'member',
  ERROR = 'error',
  INDEX = 'index'
}

export const constant = {
  AUTO_TEXTAREA_THRESH_HOLD: 50
};


export const urls = {
    GET_CLIENT_SIDE_PROPS: 'api/common/getClientSideProps'
};

export enum ColTypes {
  TIME_PICKER = 'timepicker',
  DATE_PICKER = 'date',
  READ_ONLY_DATE_PICKER = 'datereadonly',
  READ_ONLY = 'readonly',
  IN_LIST = 'inlist',
  VALIGATOR = 'valigator',
  CHIPS = 'chips',
  AUTO_DROP_DOWN = 'autodropdown',
  URL = 'url',
  TEXT_AREA = 'textarea',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean'

}

export enum HELPERS {
  PRICING_TYPE = 'pricingType',
  FILE_TYPE = 'fileType'
}

export enum DataSourceTypes {
  FARE = 'fare',
  MEMBER = 'member',
  Error = 'error',
  FAREGLOBAL = 'fareGlobal'
}

export enum EditMode {
  EDIT= 'edit',
  COPY = 'copy',
  NEW = 'new'
}

export enum D_REGION {
  QA = 'qa',
  DEV = 'dev',
  PROD = 'prod'
}
