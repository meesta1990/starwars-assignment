import React, { MouseEvent } from 'react';
import { Avatar, Button, Card } from "@mui/material";
import './ListTargetItem.css'
import { IEmpireTarget } from "../../types/EmpireMessage";
import { strings } from "../../assets/Strings";

interface IListTargetItem {
    empireTarget: IEmpireTarget;
    distance: number;
    onTargetClick(): void;
}

export const ListTargetItem = ({
    empireTarget,
    distance,
    onTargetClick
}: IListTargetItem) => {
    const handleOpenInfo = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        window.open(empireTarget.wiki, '_blank')
    }

    return (
        <div className="list-item">
            <Card variant="outlined" sx={{ display: 'flex' }} className="card" onClick={onTargetClick}>
                <div className="target-image">
                    <Avatar
                        sx={{ width: 70, height: 70 }}
                        src={empireTarget.image}
                        alt={empireTarget.name}
                    />
                </div>
                <div className="target-container">
                    <div className="target-name">{empireTarget.name}</div>
                    <div className="target-died-location">
                        {empireTarget.diedLocation ? `Deceased in ${empireTarget.diedLocation}` : 'Alive'}
                    </div>
                    <div className="target-distance">
                        <i>{`${Math.round(distance * 100) / 100} km away`}</i>
                    </div>
                    <span className="wrapper-open-info">
                         <Button
                             size="small"
                             color="primary"
                             onClick={handleOpenInfo}
                         >
                            { strings.btnMoreInfo }
                        </Button>
                    </span>
                </div>
            </Card>
        </div>
    )
}