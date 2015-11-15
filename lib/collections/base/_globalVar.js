/**
 * Created by Hieu on 11/11/2015.
 */
SoundMonitor = {};
SoundMonitor.Client = {}; // Should be available only on client side
SoundMonitor.Server = {}; // Should be available only on server side
SoundMonitor.Constants = {
    APARTMENT_SOURCE : 'All-Apartment',
    BUILDING_SOURCE : 'All-Building',
    HOME_SOURCE : 'All-Home',
    NODE_SOURCE : 'All-Node',
    DATA_SOURCE : 'All-Data',
    ALERT_TYPE : {
        success : { class : 'alert-success', notification : 'Success!', defaultMes : 'Success.'},
        warning : { class : 'alert-warning', notification : 'Warning!', defaultMes : 'Warning.'},
        info : { class : 'alert-info', notification : 'Info!', defaultMes : 'Info.'},
        error : { class : 'alert-danger', notification : 'Error!', defaultMes : 'Error.'}
    }
};