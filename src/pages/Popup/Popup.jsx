import 'material-design-lite/material.min';
import React, {useState} from 'react';
import {Button} from 'react-mdl';
import '../../assets/img/icon16.png';
import '../../assets/img/icon19.png';
import '../../assets/img/icon32.png';
import '../../assets/img/icon48.png';
import '../../assets/img/icon128.png';
import logo from '../../assets/img/logo.svg';
import {Sms} from '../../util/Sms';

export default () => {
    const [text, setText] = useState(null);

    const onSend = async () => {
        await Sms.send(text);

        setText(null);
    };

    const handleOptions = () => {
        browser.runtime.openOptionsPage
            ? browser.runtime.openOptionsPage()
            : window.open(browser.runtime.getURL('options.html'));
    };

    return <div
        style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }}
    >
        <img src={logo} alt='extension icon'
             style={{marginBottom: '15px', marginTop: '15px', maxWidth: '150px',}}/>

        <Button style={{marginBottom: '10px'}} onClick={handleOptions} raised colored ripple>
            {browser.i18n.getMessage('options')}
        </Button>

        <Button style={{marginBottom: '10px'}} onClick={onSend} raised ripple>
            {browser.i18n.getMessage('send_sms')}
        </Button>
    </div>;
}