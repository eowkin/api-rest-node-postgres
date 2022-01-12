const { pool } = require('../database/db');
const { httpError } = require('../helpers/handleError');

const getAlumnos = async (req, res) => {

  try {
    const respuesta =  await pool.query('SELECT * FROM public.alumnos');
    res.status(200).send(respuesta.rows);  
  } catch (error) {
    httpError(res, error);
  }


  
}

const getAlumnoById = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta =  await pool.query('SELECT * FROM public.alumnos where id = $1', [id]);
    if(respuesta.rowCount === 1){
      res.status(200).send(respuesta.rows[0]);
    }else{
      res.status(404).send({message: 'El recurso solicitado no existe'});
    }  
  } catch (error) {
    httpError(res, error);
  }
}

const createAlumno = async (req, res) => {
  try {
    const { cedula, nombre, direccion, email} = req.body;
    const newAlumno = await pool.query('INSERT INTO public.alumnos (cedula, nombre, direccion, email) VALUES($1, $2, $3, $4) RETURNING *', [cedula, nombre, direccion, email]);
    console.log(newAlumno);
    if(newAlumno){
      res.status(201).json({
      message: 'Alumno Creado',
      data:{
        alumno :newAlumno.rows[0]

      }
    })
    }  
  } catch (error) {
    httpError(res, error);
  }
}

const updateAlumno = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const { cedula, nombre, direccion, email} = req.body;
    const respuestaSelect =  await pool.query('SELECT * FROM public.alumnos where id = $1', [id]);
    if(respuestaSelect.rowCount === 1){
      const respuesta = await pool.query('UPDATE public.alumnos SET cedula=$1, nombre=$2, direccion=$3, email=$4 WHERE id = $5', [cedula, nombre, direccion, email, id]);
      console.log(respuesta);
      res.json({
        message: 'Alumno Update Satisfactoriamente',
        data:{
          alumno :{id, cedula, nombre, direccion, email}
        }
      })
    }else{
      res.status(404).send({mesagge: 'El recurso solicitado no existe'});
    }  
  } catch (error) {
    httpError(res, error);
  }
  
  

}



const deleteAlumnoById = async (req, res) => {
  try {
    const id = req.params.id;
    const respuestaSelect =  await pool.query('SELECT * FROM public.alumnos where id = $1', [id]);
    if(respuestaSelect.rowCount === 1){
      const respuesta =  await pool.query('DELETE FROM public.alumnos where id = $1', [id]);
      console.log(respuesta)
      res.send({mesagge:`Alumno con id: ${id} eliminado satisfactoriamente`});
    }else{
      res.status(404).send({mesagge: 'El recurso solicitado no existe'});
    }  
  } catch (error) {
    httpError(res, error);
  }
}


module.exports = {
  getAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumnoById
}