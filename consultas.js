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

    // Consulta 3: $in encuentra documentos cuya lista de etiquetas incluya cualquiera de los valores siguientes
    const cursoPorTag = await Curso.find({
      etiquetas: { $in: ["javascript", "nosql"] },
    }).select("titulo etiquetas -_id");
    console.log("\n3. Cursos con etiquetas javascript o nosql:");
    console.log(cursoPorTag);

    // Consulta 4: la ruta con punto accede a un campo de un subdocumento
    // $gte significa "mayor que o igual que"; sort(-1) ordena de mayor a menor y limit(3) trae 3 resultados
    const cursosAvanzados = await Curso.find({
      "instructor.experienciaAnios": { $gte: 8 },
    })
      .sort({ duracionHoras: -1 })
      .limit(3)
      .select("titulo duracionHoras instructor.nombre -_id");

    console.log(
      "\n4. Top cursos de instructores senior ordenados por duracion:",
    );
    console.log(cursosAvanzados);
  } catch (error) {
    console.error("Error en las consultas:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Se ha desconectado");
  }
}

ejecutarConsultas();
