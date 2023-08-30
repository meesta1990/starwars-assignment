import { API_GET_ENCRYPTED_MESSAGE, API_GET_EMPIRE_MEMBER } from "./Endpoints";

export const getEncryptedMessage = () => {
    return fetch(API_GET_ENCRYPTED_MESSAGE)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
        })
        .catch((error) => {
            throw new Error(`There was a problem with the fetch operation: ${error.message}`);
        });
}

export const getEmpireMember = (id: number) => {
    return fetch(API_GET_EMPIRE_MEMBER.replace('{id}', String(id)))
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
        })
        .catch((error) => {
            throw new Error(`There was a problem with the fetch operation: ${error.message}`);
        });
}