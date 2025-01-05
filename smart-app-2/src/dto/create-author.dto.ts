import {  IsNumber, IsString, Length } from "class-validator";
import {Genre} from "../enum/genre.enum";

export class CreateAuthorDto {


    @IsString()
    @Length(2, 128)
    public readonly firstName!: string; test

    @IsString()
    @Length(2, 128)
    public readonly lastName!: string;





}