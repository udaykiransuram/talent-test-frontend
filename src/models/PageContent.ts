import mongoose, { Schema, Document } from 'mongoose';

export interface IPageContent extends Document {
  page: string;
  content: Record<string, unknown>;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ['homepage', 'product', 'about', 'benefits', 'talent-test', 'case-study', 'contact', 'register'],
  },
  content: {
    type: Schema.Types.Mixed,
    default: {},
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);
