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

import React, { useState, useEffect, useContext } from 'react';
import { getEvent, client } from '../matrix-cypher';

import { RoomPreviewWithTopic } from './RoomPreview';
import InviteTile from './InviteTile';
import { SafeLink, LinkKind } from '../parser/types';
import UserPreview, { WrappedInviterPreview } from './UserPreview';
import EventPreview from './EventPreview';
import GroupPreview from './GroupPreview';
import HomeserverOptions from './HomeserverOptions';
import DefaultPreview from './DefaultPreview';
import Toggle from './Toggle';
import { clientMap } from '../clients';
import {
    getRoomFromId,
    getRoomFromAlias,
    getRoomFromPermalink,
    getUser,
    getGroup,
} from '../utils/cypher-wrapper';
import { ClientContext } from '../contexts/ClientContext';
import useHSs from '../utils/getHS';

interface IProps {
    link: SafeLink;
}

const invite = async ({
    clientAddress,
    link,
}: {
    clientAddress: string;
    link: SafeLink;
}): Promise<JSX.Element> => {
    // TODO: replace with client fetch
    switch (link.kind) {
        case LinkKind.Alias:
            return (
                <RoomPreviewWithTopic
                    room={
                        await getRoomFromAlias(clientAddress, link.identifier)
                    }
                />
            );

        case LinkKind.RoomId:
            return (
                <RoomPreviewWithTopic
                    room={await getRoomFromId(clientAddress, link.identifier)}
                />
            );

        case LinkKind.UserId:
            return (
                <UserPreview
                    user={await getUser(clientAddress, link.identifier)}
                    userId={link.identifier}
                />
            );

        case LinkKind.Permalink:
            return (
                <EventPreview
                    room={await getRoomFromPermalink(clientAddress, link)}
                    event={
                        await getEvent(
                            await client(clientAddress),
                            link.roomLink,
                            link.eventId
                        )
                    }
                />
            );

        case LinkKind.GroupId:
            return (
                <GroupPreview
                    group={await getGroup(clientAddress, link.identifier)}
                    groupId={link.identifier}
                />
            );

        default:
            // Todo Implement events
            return <></>;
    }
};

interface PreviewProps extends IProps {
    client: string;
}

const Preview: React.FC<PreviewProps> = ({ link, client }: PreviewProps) => {
    const [content, setContent] = useState(<DefaultPreview link={link} />);

    // TODO: support multiple clients with vias
    useEffect(() => {
        (async (): Promise<void> =>
            setContent(
                await invite({
                    clientAddress: client,
                    link,
                })
            ))();
    }, [link, client]);

    return content;
};

const LinkPreview: React.FC<IProps> = ({ link }: IProps) => {
    let content: JSX.Element;
    const [showHSOptions, setShowHSOPtions] = useState(false);

    const hses = useHSs({ link });

    if (!hses.length) {
        content = (
            <>
                <DefaultPreview link={link} />
                <Toggle
                    checked={showHSOptions}
                    onChange={(): void => setShowHSOPtions(!showHSOptions)}
                >
                    About {link.identifier}
                </Toggle>
            </>
        );
        if (showHSOptions) {
            content = (
                <>
                    {content}
                    <HomeserverOptions link={link} />
                </>
            );
        }
    } else {
        content = <Preview link={link} client={hses[0]} />;
    }

    const [{ clientId }] = useContext(ClientContext);

    // Select which client to link to
    const displayClientId = clientId
        ? clientId
        : link.arguments.client
        ? link.arguments.client
        : null;

    const client = displayClientId ? clientMap[displayClientId] : null;

    const sharer = link.arguments.sharer ? (
        <WrappedInviterPreview
            link={{
                kind: LinkKind.UserId,
                identifier: link.arguments.sharer,
                arguments: { vias: [], originalParams: new URLSearchParams() },
                originalLink: '',
            }}
        />
    ) : (
        <p style={{ margin: '0 0 10px 0' }}>You're invited to join</p>
    );

    return (
        <InviteTile client={client} link={link}>
            {sharer}
            {content}
        </InviteTile>
    );
};

export default LinkPreview;
