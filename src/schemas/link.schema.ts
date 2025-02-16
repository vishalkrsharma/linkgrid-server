import { Prop } from '@nestjs/mongoose';

export class Link {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  link: string;
}
