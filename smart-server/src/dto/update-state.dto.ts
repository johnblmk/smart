import {  IsString } from "class-validator";

export class UpdateStateDto {
    @IsString()
    public readonly state!: string;

    @IsString()
    public readonly gameId!: string;
}