import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Author} from "./author.entity";
import {Genre} from "../enum/genre.enum";
@Entity({ name: 'books' })
export class Book {

    /**
     * A unique identifier for this entity.
     */
    @PrimaryGeneratedColumn()
    public readonly id!: number;

    @Column()
    public title!: string;

    @Column({name: 'author_id'})
    public authorId!: number;

    @ManyToOne(() => Author, author => author.books)
    @JoinColumn({ name: 'author_id' })
    public readonly author!: Author;

    @Column({type: 'enum', enum: Genre})
    public genre!: Genre;

    @Column({name: 'num_pages'})
    public numPages!: number;


    constructor(init?: BookInit) {
        if (init) {
            this.title = init.title;
            this.author = init.author;
            this.genre = init.genre;
            this.numPages = init.numPages;
            this.authorId = init.author.id;
        }
    }

}


export interface BookInit {

        /**
        * The title of the book.
        */
        readonly title: string;

        /**
        * The author of the book.
        */
        readonly author: Author;

        /**
        * The genre of the book.
        */
        readonly genre: Genre;

        /**
        * The number of pages in the book.
        */
        readonly numPages: number;
}