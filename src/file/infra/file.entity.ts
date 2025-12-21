import { DefaultEntity } from 'src/common/default.entity';
import { AfterLoad, Column, Entity } from 'typeorm';
import { EFileUsage } from '../domain/enum';

@Entity({ name: 'file', comment: '파일' })
export class FileEntity extends DefaultEntity {
  urlOrigin: string;
  url512: string | null;
  url256: string | null;
  url128: string | null;

  @Column('varchar', { comment: '원본 파일 이름' })
  originalName: string;

  @Column('int', { comment: '원본 파일 크기(MB)' })
  fileSize: number;

  @Column('enum', {
    comment: '용도',
    enum: EFileUsage,
    default: EFileUsage.OTHER,
  })
  usage: EFileUsage;

  @Column('varchar', { comment: '원본 파일 경로' })
  pathOrigin: string;
  @Column('varchar', {
    comment: 'Width 512px 비율유지 파일 경로',
    nullable: true,
  })
  path512: string | null;
  @Column('varchar', { comment: '256x256px 썸네일 경로', nullable: true })
  path256: string | null;
  @Column('varchar', { comment: '128x128px 썸네일 경로', nullable: true })
  path128: string | null;

  @AfterLoad()
  afterLoad() {
    // BASE URL + path = Entire Url

    this.urlOrigin = `${process.env.FILE_BASE_URL}/${this.pathOrigin}`;
    this.url512 = this.path512
      ? `${process.env.FILE_BASE_URL}/${this.path512}`
      : null;
    this.url256 = this.path256
      ? `${process.env.FILE_BASE_URL}/${this.path256}`
      : null;
    this.url128 = this.path128
      ? `${process.env.FILE_BASE_URL}/${this.path128}`
      : null;
  }
}
