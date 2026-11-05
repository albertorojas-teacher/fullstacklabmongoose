import mongoose from "mongoose";
import Curso from "../models/Curso.js";

// Punto de entrada de la nuestra Api: recibe una peticion HTTP y construye una respuesta JSON

export default async function handler(req, res) {
  // Solo se permite consultar cursos mediante GET
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Metodo no permitido" });
  }

  try {
    // Abre la conexion solo si no existe una activa; evita reconectar en cada peticion
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Lea todos los filtros opcionales de la URL, por ejemplo ?categoria=Backend&precioMax=50
    const { categoria, precioMax, tag } = req.query;

    // El filtro base excluye borradores; las condiciones siguientes se agregan solo si se solicitan

    const filtro = { publicado: true };

    // Añadir una condicion de igualdad para la categoria indicada
    if (categoria) {
      filtro.categoria = categoria;
    }

    // $lte que significa "menor o igual que"; Number convierte el parametro de texto a numero
    if (precioMax) {
      filtro.precio = { $lte: Number(precioMax) };
    }

    // Si encuentra documentos cuyo arreglo de etiquetas contenga el valor indicado
    if (tag) {
      filtro.etiquetas = { $in: [tag.toLowerCase()] };
    }

    // Buscar los documentos coincidentes, limitar los campos de salida y ademas vamos a ordenar por precio ascendente(1)
    const cursos = await Curso.find(filtro)
      .select(
        "codigo titulo categoria precio duracionHoras etiquetas instructor",
      )
      .sort({ precio: 1 });

    //   Va a reponder con estado 200 e incluye el total, el filtro aplicado y los resultados

    return res.status(200).json({
      total: cursos.length,
      filtrosAplicados: filtro,
      datos: cursos,
    });
  } catch (error) {
    // Registra el error completo en el servidor, sin exponer detalles internos al cliente
    console.error("Error en /api/cursos:", error);

    const respuesta = { error: "Error al consultar la base de datos" };

    // En desarrollo se incluye el detalle para facilitar la depuracion
    if (process.env.NODE_ENV !== "production") {
      respuesta.detalle = error.message;
    }

    return res.status(500).json(respuesta);
  }
}
