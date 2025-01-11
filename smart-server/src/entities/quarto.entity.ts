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

    constructor(init?: QuartoInit) {
        if (init) {
            this.state = init.state;
        }
    }

}


export interface QuartoInit {

        /**
        * The state of the game.
        */
        readonly state: string;

}