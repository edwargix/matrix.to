/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useReducer } from 'react';
import { UserAgentProvider } from '@quentin-sommer/react-useragent';

import {
    ClientProvider,
    reducer as clientReducer,
    initialState as clientInitialState,
} from './ClientContext';
import {
    HSProvider,
    reducer as HSReducer,
    initialState as HSInitialState,
    unpersistedReducer as HSTempReducer,
    TempHSProvider,
} from './HSContext';

interface IProps {
    children: React.ReactNode;
}

export default ({ children }: IProps): JSX.Element => (
    <UserAgentProvider ua={window.navigator.userAgent}>
        <ClientProvider value={useReducer(clientReducer, clientInitialState)}>
            <HSProvider value={useReducer(HSReducer, HSInitialState)}>
                <TempHSProvider
                    value={useReducer(HSTempReducer, HSInitialState)}
                >
                    {children}
                </TempHSProvider>
            </HSProvider>
        </ClientProvider>
    </UserAgentProvider>
);
