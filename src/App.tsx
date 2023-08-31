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
    const dispatch = useDispatch();
    const decryptedMessageState = useSelector((state: RootState) => state.empireMessageSlice);
    let lastScrollY = window.scrollY;

    //calculate height without address bar
    const appHeight = () => {
        const doc = document.documentElement
        doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }

    useEffect(() => {
        appHeight();
        window.addEventListener('resize', appHeight);

        setTimeout(() => {
            setShowMessage(true)
        }, 1000)
        return () => {
            window.removeEventListener('resize', () => {})
        }
    }, []);

    const handleDecipherMessage = () => {
        setLoadingDecipher(true);

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
                            <span>{ loadingDecipher ? strings.messageReceivedDecipheringBtn : strings.messageReceivedBtn }</span>
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
