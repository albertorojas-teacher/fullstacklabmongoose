import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, "El codigo del curso es obligatorio"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    titulo: {
      type: String,
      required: [true, "El titulo es obligatorio"],
      trim: true,
      minlength: [5, "El titulo debe tener al menos 5 caracteres"],
    },
    categoria: {
      type: String,
      required: true,
      enum: {
        values: ["Frontend", "Backend", "DevOps", "Base de Datos"],
        message: "{VALUE}, no es una categoria valida",
      },
    },
    precio: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"],
      default: 0,
    },
    duracionHoras: {
      type: Number,
      required: true,
      min: 1,
    },
    etiquetas: {
      type: [String],
      default: [],
    },
    instructor: {
      nombre: { type: String, required: true },
      experienciaAnios: { type: Number, min: 1 },
    },
    publicado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Curso = mongoose.models.Curso || mongoose.model("Curso", cursoSchema);

export default Curso;
