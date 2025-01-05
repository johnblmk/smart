import { PartialType } from "@nestjs/mapped-types";
import {CreateAuthorDto} from "./create-author.dto";

/**
 * A data transfer object describing sparse updates to a `task` entity.
 */
export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {

}