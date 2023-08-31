import React, { ReactNode } from 'react';
import classNames from "classnames";
import "./Message.css"

interface IMessageReceived {
    className?: string;
    showMessage: boolean;
    title?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
}

export const MessageReceived = ({
    showMessage,
    className = '',
    title,
    body,
    footer
}: IMessageReceived) => {
    return (
        <div className={classNames('wrapper-message', className, showMessage && 'active')}>
            { title &&
                <>
                    <h3 className="title">
                        { title }
                    </h3>
                    <div className="divider" />
                </>
            }
            { body &&
                <div className="body">
                    { body }
                </div>
            }
            { footer &&
                <div className="footer">
                    { footer }
                </div>
            }
        </div>
    )
};