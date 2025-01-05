import {  IsNumber, IsString, Length } from "class-validator";
import {Genre} from "../enum/genre.enum";

export class CreateBookDto {

    /**
     * The id of the project to which this task belongs
     */
    @IsNumber()
    public readonly authorId!: number;

    @IsString()
    @Length(2, 128)
    public readonly title!: string;

    @IsNumber()
    public readonly numPages!: number;

    @IsString()
    public readonly genre!: Genre;




}