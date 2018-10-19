import { Directive, OnInit } from '@angular/core';
declare var $: any

@Directive({
    selector: '[appFullDate]',
    host: {
        "data-provide": "datepicker",
        "class": "datepicker",
        "data-date-format": "dd/mm/yyyy",
    }
})

export class FullDateDirective {

    constructor() { }
    ngAfterViewInit() {
        $(document).ready(function () {
            $('.datepicker').datepicker({
                format: 'dd/mm/yyyy',
                language: 'pt'
            });
        });
    }
}
