export interface RootState {
    empireMessageSlice: IEmpireTarget[];
}

export interface IEmpireMessage {
    id: number;
    lat: number;
    long: number;
}

export interface IEmpireTarget extends IEmpireMessage {
    id: number,
    name: string,
    height: number,
    mass: number,
    gender: string,
    homeworld: string,
    wiki: string,
    image: string,
    born: number,
    died: number,
    diedLocation: string,
    species: string,
    hairColor: string,
    eyeColor: string,
    skinColor: string,
    cybernetics: string,
    affiliations: string[],
    masters: string[],
    apprentices: string[],
    formerAffiliations: string[]
}