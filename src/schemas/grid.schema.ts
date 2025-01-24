import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GridDocument = HydratedDocument<Grid>;

@Schema({ timestamps: true })
export class Grid {
  @Prop({
    required: true,
    ref: 'User',
    type: Types.ObjectId,
  })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String })
  identifier: string;

  @Prop({ type: [String] })
  links: string[];
}

export const GridSchema = SchemaFactory.createForClass(Grid);
