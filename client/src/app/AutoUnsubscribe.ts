export function AutoUnsubscribe( blackList: any[] = [] ): any{

  return ( constructor: any ) => {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function(): void {
      // tslint:disable-next-line:forin
      for ( const prop in this ) {
        const property = this[ prop ];
        if ( !blackList.includes(prop) ) {
          if ( property && ( typeof property.unsubscribe === 'function' ) ) {
            // tslint:disable-next-line:no-console
            console.debug(`AutoUnsubscribe: unsubscribed from ${prop}`);
            property.unsubscribe();
          }
        }
      }
      return original && typeof original === 'function' && original.apply(this, arguments);
    };
  };
}
