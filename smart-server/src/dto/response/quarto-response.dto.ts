import {Quarto} from "../../entities/quarto.entity";

export class QuartoResponseDto {
    public readonly state!: object;

    public readonly isAdmin!: boolean;

    public constructor(clientId: string, qaurto?: Quarto) {
        if (!qaurto) {
            this.state = {};
            this.isAdmin = false;
            return;
        }
        this.isAdmin = clientId == qaurto.player1Id;
    }
}