import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Book} from "./entities/book.entity";
import {DeleteResult, Repository} from "typeorm";
import {Author} from "./entities/author.entity";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {CreateAuthorDto} from "./dto/create-author.dto";
import {UpdateAuthorDto} from "./dto/update-author.dto";
import {Quarto} from "./entities/quarto.entity";

@Injectable()
export class AppService {

    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
        @InjectRepository(Quarto) private readonly quartoRepository: Repository<Quarto>,
    ) {}


    getHello(): string {
        console.log('Hello World!')
        return 'Hello World!';
    }


    async findAllBooks(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async findBookById(id: number): Promise<Book> {
        return this.bookRepository.findOne({where: {id}});
    }

    async createBook(createBookDto: CreateBookDto): Promise<Book> {
        const author = await this.authorRepository.findOne({where: {id: createBookDto.authorId}});
        const book = new Book({
            title: createBookDto.title,
            author,
            genre: createBookDto.genre,
            numPages: createBookDto.numPages
        });

        return this.bookRepository.save(book);
    }

    async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
        const book = await this.bookRepository.findOne({where: {id}});

        if (updateBookDto.title) {
            book.title = updateBookDto.title;
        }

        if (updateBookDto.genre) {
            book.genre = updateBookDto.genre;
        }

        if (updateBookDto.numPages) {
            book.numPages = updateBookDto.numPages;
        }

        if (updateBookDto.authorId) {
            book.authorId = updateBookDto.authorId;
        }

        return this.bookRepository.save(book);
    }

    async deleteBook(id: number): Promise<DeleteResult> {
        return this.bookRepository.delete({id});
    }

    async findAuthors(): Promise<Author[]> {
        return this.authorRepository.find();
    }


    async findAuthorById(id: number): Promise<Author> {
        return this.authorRepository.findOne({where: {id}});
    }

    async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
        const author = new Author({
            firstName: createAuthorDto.firstName,
            lastName: createAuthorDto.lastName
        });
        return this.authorRepository.save(author);
    }

    async updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
        const author = await this.authorRepository.findOne({where: {id}});

        if (updateAuthorDto.firstName) {
            author.firstName = updateAuthorDto.firstName;
        }

        if (updateAuthorDto.lastName) {
            author.lastName = updateAuthorDto.lastName;
        }

        return this.authorRepository.save(author);
    }

    async deleteAuthor(id: number): Promise<DeleteResult> {
        return this.authorRepository.delete({id});
    }










    async getQuarto(): Promise<object> {
        let state = (await this.quartoRepository.findOne({where: {id: 1}})).state;

        return JSON.parse(state);
    }




    async getQuartoById(gameId: string, clientId: string): Promise<Quarto|null> {
        let quarto = await this.quartoRepository.findOne({where: {gameId}});

        if (quarto) {

            if (quarto.player1Id !== null && quarto.player2Id !== null) {
                if (clientId !== quarto.player1Id && clientId !== quarto.player2Id) {
                    throw new Error('You are not a player in this game');
                }
            }

            return quarto;
        }

        return null;

    }

    async postQuarto(state: string, gameId: string, clientId: string): Promise<Quarto> {
        const quarto = await this.quartoRepository.findOne({where: {gameId}});

        if (!quarto || !quarto.player1Id) {
            return await this.quartoRepository.save(new Quarto({state, gameId, player1Id: clientId}));
        } else if (!quarto.player2Id) {
            quarto.player2Id = clientId;
        }

        quarto.state = state;
        await this.quartoRepository.save(quarto);
        return quarto;
    }



}
