export interface IPokemonSpecies {
    name: string,
    description: string,
    color: string,
    gender_rate: number,
    egg_groups: string[],
    hatch_steps: number,
    catch_rate: number
}