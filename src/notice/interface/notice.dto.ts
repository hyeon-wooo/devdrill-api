import { PartialType } from "@nestjs/mapped-types";

export class NoticeCreateBodyDto {
    title: string;
    content: string;
    isActive: boolean;
    isFixed: boolean;
}

export class NoticeUpdateBodyDto extends PartialType(NoticeCreateBodyDto) {}