import { Schema } from 'mongoose'

const FEATURES: string[] = [
  'menu',
  'prepare_env',
  'delivery',
  'qrcode',
  'dash',
  'stock',
  'neighborhoodFee',
  'pix',
  'shortLink',
]

const PlansSchema = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    promotions: [
      {
        params: String, // jsonstringfy to extra infos in site
        startDate: Date,
        endDate: Date,
        price: Number,
      },
    ],
    features: [{ type: String, enum: FEATURES }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default PlansSchema
