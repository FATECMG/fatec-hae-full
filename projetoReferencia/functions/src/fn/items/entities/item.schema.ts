import { Schema } from 'mongoose'

const ItemSchema = new Schema(
  {
    name: { type: String },
    alias: String,
    description: { type: String },
    photos: [{ type: String, default: [] }],
    typesOfConsumption: {
      type: [{ type: String, enum: ['Consumo Local', 'Retirada', 'Delivery'] }],
      default: ['Consumo Local', 'Retirada', 'Delivery'],
    },
    subItems: [
      {
        isComposite: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        question: { type: String },
        selectQuantity: { type: Number },
        selectMinQuantity: { type: Number, default: 0 },
        options: [
          {
            item: { type: Schema.Types.ObjectId, ref: 'items' },
            price: { type: Number },
          },
        ],
      },
    ],
    complements: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'items' },
        price: { type: Number },
      },
    ],
    stock: {
      available: { type: Boolean, default: false },
      quantity: { type: Number, default: 0 },
      totalQuantity: { type: Number, default: 0 },
    },
    tributeInfos: {
      ncm: { type: String },
      cfop: { type: String },
      valor: { type: Number },
      valorUnitario: {
        comercial: { type: Number },
        tributavel: { type: Number },
      },
      tributos: {
        icms: {
          origem: { type: String },
          cst: { type: String },
          baseCalculo: {
            modalidadeDeterminacao: { type: Number },
            valor: { type: Number },
          },
          aliquota: { type: Number },
          valor: { type: Number },
        },
        pis: {
          cst: { type: String },
          baseCalculo: {
            valor: { type: Number },
            quantidade: { type: Number },
          },
          aliquota: { type: Number },
          valor: { type: Number },
        },
        cofins: {
          cst: { type: String },
          baseCalculo: {
            valor: { type: Number },
          },
          aliquota: { type: Number },
          valor: { type: Number },
        },
      },
    },
    prepareTime: Number,
    type: { type: String },
    prepareEnv: { type: String, enum: ['Cozinha', 'Bar'] },
    stockControl: {
      type: String,
      enum: ['controlled', 'uncontrolled'],
      default: 'uncontrolled',
    },
    hasPhotos: { type: Boolean },
    isNotPodiumCalc: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    business: { type: Schema.Types.ObjectId, ref: 'businesses' },
    observations: [{ type: String }],
  },
  { timestamps: true },
)

export default ItemSchema
