'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ServiceModel = void 0
const mongoose_1 = __importStar(require('mongoose'))
const service_interface_1 = require('./service.interface')
const service_enum_1 = require('../../shared/enums/service.enum')
const serviceSchema = new mongoose_1.default.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: service_enum_1.CATEGORIES, required: true },
    subCategory: {
      type: String,
      enum: service_enum_1.SUB_CATEGORIES,
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ img: { type: String, required: true } }],
    description: { type: String, required: true },
    availability: { type: Boolean, default: true },
    seller: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    shop: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'shop',
      required: true,
    },
    status: {
      type: String,
      enum: service_interface_1.ServiceStatusList,
      default: service_interface_1.ServiceStatusList.PENDING,
    },
    reviews: [
      {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
          type: mongoose_1.Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
        date: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)
// Custom method example in the IServiceModel interface
serviceSchema.statics.findByName = async function (name) {
  return this.findOne({ name }).exec()
}
exports.ServiceModel = mongoose_1.default.model('service', serviceSchema)
