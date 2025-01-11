import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import { AppService } from './app.service';
import {Book} from "./entities/book.entity";
import {DeleteResult} from "typeorm";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {Author} from "./entities/author.entity";
import {UpdateAuthorDto} from "./dto/update-author.dto";
import {CreateAuthorDto} from "./dto/create-author.dto";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("hello")
    getHello(): string {
        return this.appService.getHello();
    }


    @Get("books")
    async findAllBooks(
    ): Promise<Book[]> {

        return this.appService.findAllBooks();
    }

    @Get("books/:id")
    async findBookById(
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<Book> {
        return this.appService.findBookById(bookId);
    }



    @Post("books")
    async create(
        @Body() createBookDto: CreateBookDto,
    ): Promise<Book> {
        return this.appService.createBook(createBookDto);
    }

    @Patch("books/:bookId")
    async updateBook(
        @Body() updateBookDto: UpdateBookDto,
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<Book> {

        return this.appService.updateBook(bookId, updateBookDto);
    }

    @Delete('books/:bookId')
    async delete(
        @Param('bookId', ParseIntPipe) bookId: number,
    ): Promise<DeleteResult> {
        return this.appService.deleteBook(bookId);
    }


    @Get("authors")
    async findAllAuthors(
    ): Promise<Author[]> {

        return this.appService.findAuthors();
    }

    @Get("authors/:id")
    async findAuthorById(
        @Param('authorId', ParseIntPipe) authorId: number,
    ): Promise<Author> {
        return this.appService.findAuthorById(authorId);
    }

    @Post("authors")
    async createAuthor(
        @Body() createAuthorDto: CreateAuthorDto,
    ): Promise<Author> {
        return this.appService.createAuthor(createAuthorDto);
    }

    @Patch("authors/:authorId")
    async updateAuthor(
        @Body() updateAuthorDto: UpdateAuthorDto,
        @Param('authorId', ParseIntPipe) authorId: number,
    ): Promise<Author> {
        return this.appService.updateAuthor(authorId, updateAuthorDto);
    }

    @Delete('authors/:authorId')
    async deleteAuthor(
        @Param('authorId', ParseIntPipe) authorId: number,
    ): Promise<DeleteResult> {
        return this.appService.deleteAuthor(authorId);
    }


}
