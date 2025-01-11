import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from "./book.entity";

@Entity({ name: 'authors' }) // Corrected the entity name to reflect 'authors'
export class Author {
    /**
     * A unique identifier for this entity.
     */
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column({ name: 'first_name' })
    public firstName!: string;

    @Column({ name: 'last_name' })
    public lastName!: string;

    @OneToMany(() => Book, book => book.author)
    public readonly books!: Book[];

    /**
     * Constructor for the Author entity.
     *
     * @param init Configuration options for initializing the author.
     */
    constructor(init?: AuthorInit) {
        if (init) {
            this.firstName = init.firstName;
            this.lastName = init.lastName;
        }
    }
}

/**
 * Interface for author initialization.
 */
export interface AuthorInit {
    /**
     * The first name of the author.
     */
    readonly firstName: string;

    /**
     * The last name of the author.
     */
    readonly lastName: string;
}
