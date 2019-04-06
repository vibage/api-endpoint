import { Document, Model, model, Schema } from "mongoose";

export interface IQueuerModel extends Document {
  uid: string;
  tokens: number;
}

export const QueuerSchema: Schema = new Schema({
  uid: String,
  tokens: Number,
});

export const Queuer: Model<IQueuerModel> = model<IQueuerModel>(
  "queuer",
  QueuerSchema,
);
