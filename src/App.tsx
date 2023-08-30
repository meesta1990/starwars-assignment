import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import LoadingButton from "@mui/lab/LoadingButton";
import './App.css';
import SpaceBackground from "./components/SpaceBackground/SpaceBackground";
import { MessageReceived } from "./components/Message/Message";
import {getEmpireMember, getEncryptedMessage} from "./services/RebellionService";
import { addMessage, updateMessage } from "./store/empireMessageSlice";
import { strings } from "./assets/Strings";
import { Map } from "./components/Map/Map";
import {IEmpireMessage, IEmpireTarget, RootState} from "./types/EmpireMessage";

function App() {
    const [showMessage, setShowMessage] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [loadingDecipher, setLoadingDecipher] = useState(false);
    let fakeHeavyLoad: NodeJS.Timeout | undefined;
    const dispatch = useDispatch();
    const decryptedMessageState = useSelector((state: RootState) => state.empireMessageSlice);

    useEffect(() => {
        setTimeout(() => {
            setShowMessage(true)
        }, 1000)
    }, []);

    const handleDecipherMessage = () => {
        setLoadingDecipher(true);

        if(fakeHeavyLoad) {
            clearTimeout(fakeHeavyLoad)
        }
        fakeHeavyLoad = setTimeout(() => {
            getEncryptedMessage().then((response) => {
                const decryptedMessage = JSON.parse(atob(response.message));
                if (decryptedMessage) {
                    const promises = [];

                    for(let i=0; i < decryptedMessage.length; i++) {
                        dispatch(addMessage(decryptedMessage[i]));
                        promises.push(
                            getEmpireMember(decryptedMessage[i].id).then((response) => {
                                const empireTarget = response as IEmpireTarget;
                                empireTarget.lat = decryptedMessage[i].lat;
                                empireTarget.long = decryptedMessage[i].long;
                                dispatch(updateMessage(empireTarget));
                            })
                        );
                    }

                    Promise.all(promises).then((values) => {
                        setLoadingDecipher(false);
                        setShowMessage(false);
                        setShowMap(true);
                    });
                }
            })
        }, 2000);
    };

    return (
        <div className="App">
            <SpaceBackground />

            <div className="content">
                <MessageReceived
                    showMessage={showMessage && !showMap}
                    title={strings.messageReceivedFromRebellionTitle}
                    body={strings.messageReceivedFromRebellionBody}
                    className="message-from-leia"
                    footer={
                        <LoadingButton
                            color="secondary"
                            onClick={handleDecipherMessage}
                            endIcon={<NoEncryptionIcon />}
                            loading={loadingDecipher}
                            loadingPosition="end"
                            variant="contained"
                        >
                            { strings.messageReceivedBtn }
                        </LoadingButton>
                    }
                />

                <MessageReceived
                    className="map-container"
                    showMessage={showMap && !showMessage}
                    body={
                        <Map
                            empireTargets={decryptedMessageState}
                        />
                    }
                />
            </div>
        </div>
    );
}

export default App;
