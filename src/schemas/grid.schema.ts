import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Link } from 'src/schemas/link.schema';

export type GridDocument = HydratedDocument<Grid>;

@Schema({ timestamps: true })
export class Grid {
  @Prop({
    required: true,
    ref: 'User',
    type: Types.ObjectId,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  identifier: string;

  @Prop({
    type: [Link],
    default: [],
  })
  links: Link[];
}

export const GridSchema = SchemaFactory.createForClass(Grid);
