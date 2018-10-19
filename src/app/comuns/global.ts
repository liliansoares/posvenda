'use strict';
export const propertiesDTO = 'propertiesDTOSession_cap-posvenda';
export const userSession = 'userSession_key_cap-posvenda';
export const plataforma = 'cap-posvenda';
export const currentUser = 'currentUser_cap-posvenda';

export const gwAppKey = '?gw-app-key=';
export const auth = '5e9c4d6013e60135e6590a7aff8a70b7';
export const authGta = '9826a9e07ab701353a6802abb3cba86d';
export const urlCache = 'http://util/cache?key=';
export const labelCacheLogin = 'gta_login_@';

export let user;

export const globalToast = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': true,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

export const recuperaPropertiesSession = function (): any {
    return null;
};

export const recuperaAuth = function (): any {
    return gwAppKey + auth;
};

export const recuperaAuthGTA = function (): any {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        return '';
    } else {
        return gwAppKey + authGta;
    }
};

export const recuperaUsuarioSession = function (): any {
    const properties = sessionStorage.getItem(userSession);
    if (properties) {
        return JSON.parse(properties);
    } else {
        return null;
    }
};

export const recuperaMenuSession = function (): any {
    const properties = sessionStorage.getItem(userSession);
    if (properties) {
        return JSON.parse(properties).plataformas;
    } else {
        return null;
    }
};
