import mongoose from "mongoose";
import dotenv from "dotenv";
import Curso from "./models/Curso.js";

dotenv.config();

const cursosIniciales = [
  {
    codigo: "MERN-101",
    titulo: "Fundamentos de React y Estado Moderno",
    categoria: "Frontend",
    precio: 39.99,
    duracionHoras: 18,
    etiquetas: ["react", "javascript", "hooks", "ui"],
    instructor: { nombre: "Laura Gómez", experienciaAnios: 6 },
    publicado: true,
  },
  {
    codigo: "NODE-202",
    titulo: "APIs RESTful con Node.js y Express",
    categoria: "Backend",
    precio: 49.99,
    duracionHoras: 24,
    etiquetas: ["node", "express", "api", "javascript"],
    instructor: { nombre: "Carlos Ruiz", experienciaAnios: 8 },
    publicado: true,
  },
  {
    codigo: "MONGO-301",
    titulo: "Modelado de Datos con MongoDB y Mongoose",
    categoria: "Base de Datos",
    precio: 29.5,
    duracionHoras: 12,
    etiquetas: ["mongodb", "mongoose", "nosql", "node"],
    instructor: { nombre: "Carlos Ruiz", experienciaAnios: 8 },
    publicado: true,
  },
  {
    codigo: "DEVOPS-401",
    titulo: "Despliegue Continuo en Vercel y Docker",
    categoria: "DevOps",
    precio: 59.0,
    duracionHoras: 15,
    etiquetas: ["docker", "vercel", "ci-cd"],
    instructor: { nombre: "Elena Martín", experienciaAnios: 10 },
    publicado: true,
  },
  {
    codigo: "NEXT-501",
    titulo: "Arquitectura Fullstack con Next.js (Borrador)",
    categoria: "Frontend",
    precio: 65.0,
    duracionHoras: 30,
    etiquetas: ["nextjs", "react", "ssr"],
    instructor: { nombre: "Laura Gómez", experienciaAnios: 6 },
    publicado: false,
  },
];

async function poblarBaseDeDatos() {
  try {
    // Abro la conexion a la base de datos usando la URI configurada en .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDBAtlas");

    // Elimina todos los cursos existentes para que cada ejecucion parta del mismo conjunto de datos
    await Curso.deleteMany({});
    console.log("Coleccion anterior limpiada");

    // Insertar el arreglo completo. Moongose valida cada documento antes de guardarlo
    const insertados = await Curso.insertMany(cursosIniciales);
    console.log(`Se insertaron ${insertados.length} cursos correctamente`);

    // Intentaremos guardar un curso que no cumple con varias reglas para que observemos los
    //  errores de validacion
    console.log("\n---Probando el escudo de validacion ----");
    try {
      await Curso.create({
        codigo: "ERR-999",
        titulo: "JS", // Falla: menos de 5 caracteres
        categoria: "Diseño Gráfico", // Falla: no está en el enum
        precio: -15, // Falla: precio negativo
        duracionHoras: 10,
        instructor: { nombre: "Pedro" },
      });
    } catch (errorValidacion) {
      // Recorrer los errores por campo para mostrar que regla rechazo cada dato
      console.log("Mongoose bloqueo el documento invalido con exito");
      Object.values(errorValidacion.errors).forEach((err) => {
        console.log(`- Campo [${err.path}: ${err.message}]`);
      });
    }
  } catch (error) {
    // Informa de errores generales, como por ejemplo fallos de conexion, fallo en la insercion de datos.
    console.error("Error General:", error.message);
  } finally {
    // Cierra la operacion, incluso si la operacion falla.
    await mongoose.disconnect();
    console.log("\nDesconectado de mongoDB Atlas");
  }
}

poblarBaseDeDatos();
