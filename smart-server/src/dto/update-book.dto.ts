import { PartialType } from "@nestjs/mapped-types";
import {CreateBookDto} from "./create-book.dto";

/**
 * A data transfer object describing sparse updates to a `task` entity.
 */
export class UpdateBookDto extends PartialType(CreateBookDto) {

}