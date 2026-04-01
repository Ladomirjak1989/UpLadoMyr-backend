import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName!: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    message!: string;
}