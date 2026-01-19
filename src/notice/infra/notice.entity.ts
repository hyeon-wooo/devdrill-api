import { DefaultEntity } from "src/common/default.entity";
import { Column, Entity } from "typeorm";

@Entity({name: 'notice', comment: '공지사항'})
export class NoticeEntity extends DefaultEntity {
    @Column('varchar', { comment: '제목' })
    title: string;

    @Column('text', { comment: '내용' })
    content: string;

    @Column('boolean', { default: false, comment: '표시 여부' })
    isActive: boolean;

    @Column('boolean', { default: false, comment: '고정 여부' })
    isFixed: boolean;
}