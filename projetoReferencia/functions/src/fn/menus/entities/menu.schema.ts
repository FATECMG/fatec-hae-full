import { Schema } from 'mongoose'

const MenuSchema: Schema = new Schema(
  {
    name: { type: String, require: true },
    itemsPrice: [
      {
        order: { type: Number },
        item: { type: Schema.Types.ObjectId, ref: 'items' },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        typesOfConsumption: {
          type: [
            { type: String, enum: ['Consumo Local', 'Retirada', 'Delivery'] },
          ],
          default: ['Consumo Local', 'Retirada', 'Delivery'],
        },
      },
    ],
    business: { type: Schema.Types.ObjectId, ref: 'businesses' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default MenuSchema
