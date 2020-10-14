import {Storage} from './Storage';

export default new Storage('settings', {
    apiKey: '', // must be 1st as Options.jsx depends on it
    from: '', // order
    signature: '', // is
    signaturePosition: 'append',
    to: '', // important
});