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

// disable camelcase check because our object keys come
// from the matrix spec
/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';

import { UserAvatar } from './Avatar';

export default {
    title: 'Avatar',
    parameters: {
        design: {
            type: 'figma',
            url:
                'https://www.figma.com/file/WSXjCGc1k6FVI093qhlzOP/04-Recieving-share-link?node-id=143%3A5853',
        },
    },
};

export const Default: React.FC<{}> = () => (
    <UserAvatar
        user={{
            avatar_url: 'mxc://matrix.org/EqMZYbAYhREvHXvYFyfxOlkf',
            displayname: 'Jorik Schellekens',
        }}
        userId="@jorik:matrix.org"
    />
);
