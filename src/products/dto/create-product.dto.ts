import { Transform } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { Category } from "src/common/enums/categories.enum"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description: string

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number

    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    stock: number

    @IsString()
    location: string

    image: string
    
    @IsEnum(Category)
    category: Category
}
