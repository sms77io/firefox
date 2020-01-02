import React, {Component} from 'react';
import {Button} from 'react-mdl';
import 'material-design-lite/material.min';

import logo from '../../assets/img/logo.svg';
import {Sms} from '../../util/Sms';
import {Storage} from '../../util/Storage';

export default class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            apiKey: null, // must be first as onSend() depends on it
            text: null,
            to: null,
            from: null,
        };

        this.onSend = this.onSend.bind(this);
    }


    async onSend() {
        await Sms.send(...Object.values(this.state).slice(1)); //remove API key

        this.setState({text: null});
    }

    handleOptions() {
        browser.runtime.openOptionsPage
            ? browser.runtime.openOptionsPage()
            : window.open(browser.runtime.getURL('options.html'));
    }

    async componentDidMount() {
        this.setState({
            apiKey: await Storage.getByKey(Storage.keys.apiKey),
            from: await Storage.getByKey(Storage.keys.from),
            to: await Storage.getByKey(Storage.keys.to),
        });
    }

    render() {
        return (
            <div>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <img src={logo} alt='extension icon'
                         style={{marginBottom: '15px', marginTop: '15px', maxWidth: '150px',}}/>

                    <Button style={{marginBottom: '10px'}} onClick={this.handleOptions} raised colored ripple>
                        Options
                    </Button>

                    <Button style={{marginBottom: '10px'}} onClick={this.onSend} raised ripple>
                        Send SMS
                    </Button>
                </div>
            </div>
        );
    }
}