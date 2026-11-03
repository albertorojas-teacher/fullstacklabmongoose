import mongoose from "mongoose";
import dotenv from "dotenv";
import Curso from "./models/Curso.js";

// Cargar las variables definidas en el .env, como la uri de conexion a MongoDB
dotenv.config();

async function ejecutarConsultas() {
  try {
    // Establecer la conexion a la base de datos con mongoseConect
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("===== Laboratorio de Consultas ======");

    // Consulta 1: combinar dos condiciones de igualdad; ambas deben cumplirse
    const cursosFrontend = await Curso.find({
      categoria: "Frontend",
      publicado: true,
    });
    console.log("1.- Cursos de Frontend publicados:", cursosFrontend.length);

    // Consulta 2: $lte significa "menor o igual que"; select limita los campos deseados o devueltos
    // El prefijo - excluye
    const cursosEconomicos = await Curso.find({
      precio: { $lte: 40 },
    }).select("codigo titulo precio -_id");
    console.log("\n2.Cursos por 40 EUR o menos(solo codigo, titulo y precio)");
    //
    console.table(cursosEconomicos.map((c) => c.toObject()));
  } catch (error) {
    console.error("Error en las consultas:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Se ha desconectado");
  }
}

ejecutarConsultas();
