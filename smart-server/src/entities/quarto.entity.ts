import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Author} from "./author.entity";
import {Genre} from "../enum/genre.enum";
@Entity({ name: 'quarto' })
export class Quarto {

    /**
     * A unique identifier for this entity.
     */
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column({type: "text"})
    public state!: string;

    @Column({ name: 'game_id' })
    public gameId!: string;


    @Column({ name: 'player_1_id', type: "varchar" })
    public player1Id?: string;

    @Column({ name: 'player_2_id', type: "varchar" })
    public player2Id?: string;



    constructor(init?: QuartoInit) {
        if (init) {
            this.state = init.state;
            this.gameId = init.gameId;
        }
    }

}


export interface QuartoInit {

    /**
    * The state of the game.
    */
    readonly state: string;

    /**
     * The game id.
     */
    readonly gameId: string;

    /**
     * The player 1 id.
     */
    readonly player1Id?: string;

    /**
     * The player 2 id.
     */
    readonly player2Id?: string;

}