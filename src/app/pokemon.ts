export interface IPokemon {
    id: number,
    name: string,
    height: number,
    weight: number,
    hp: number,
    attack: number,
    defence: number,
    speed: number,
    special_attack: number,
    special_defence: number,
    types: string[],
    abilities: string[]
}