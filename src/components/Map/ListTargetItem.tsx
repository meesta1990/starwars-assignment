import React, { CSSProperties } from 'react';
import {Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, Skeleton} from "@mui/material";
import './ListTargetItem.css'
import { IEmpireTarget } from "../../types/EmpireMessage";

interface IListTargetItem {
    empireTargetA?: IEmpireTarget;
    empireTargetB?: IEmpireTarget;
    style: CSSProperties;
}

interface ICardItem extends Partial<IListTargetItem> {
    target?: IEmpireTarget;
}

export const ListTargetItem = ({
    empireTargetA,
    empireTargetB,
    style,
}: IListTargetItem) => {
    return (
        <div className="list-target-row" style={style}>
            <CardItem target={empireTargetA} />
            <CardItem target={empireTargetB} />
        </div>
    )
}

const CardItem = ({
    target,
}: ICardItem) => {
    if (!target) return <></>;
    return (
        <div className="list-target-column">
            <Card variant="outlined" sx={{ display: 'flex' }} className="card">
                <div className="target-image">
                    <Avatar
                        sx={{ width: 200, height: 200 }}
                        src={target.image}
                        alt={target.name}
                    />
                </div>
                <div className="target-container">
                    <h3>{target.name}</h3>
                    <p>
                        {target.diedLocation && `Deceased in ${target.diedLocation}`}
                    </p>
                </div>
            </Card>

        </div>
    )
}