import React from 'react';
import {Avatar, Button, Card, CardActions} from "@mui/material";
import './ListTargetItem.css'
import { IEmpireTarget } from "../../types/EmpireMessage";
import { strings } from "../../assets/Strings";

interface IListTargetItem {
    empireTarget: IEmpireTarget;
    distance: number;
}

export const ListTargetItem = ({
    empireTarget,
    distance
}: IListTargetItem) => {
    return (
        <div className="list-item">
            <Card variant="outlined" sx={{ display: 'flex' }} className="card">
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
                        <i>{`Distance from you ${Math.round(distance * 100) / 100} km`}</i>
                    </div>
                    <Button
                        size="small"
                        color="primary"
                        className="btn-more-info"
                        onClick={() => window.open(empireTarget.wiki, '_blank')}
                    >
                        { strings.btnMoreInfo }
                    </Button>
                </div>
            </Card>
        </div>
    )
}