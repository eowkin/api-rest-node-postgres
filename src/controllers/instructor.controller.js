const { pool } = require('../database/db');
const { httpError } = require('../helpers/handleError');


const getInstructores = async (req, res) => {

  try {
    const respuesta =  await pool.query('SELECT * FROM public.instructor');
    res.status(200).send(respuesta.rows);  
  } catch (error) {
    httpError(res, error);
  }
  
}

const getInstructorById = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta =  await pool.query('SELECT * FROM public.instructor where id = $1', [id]);
    if(respuesta.rowCount === 1){
      res.status(200).send(respuesta.rows);
    }else{
      res.status(404).send({message: 'El recurso solicitado no existe'});
    }  
  } catch (error) {
    httpError(res, error);
  }
   
  
}

const createInstructor = async (req, res) => {
  try {
    const { cedula, nombre, direccion, email} = req.body;
    const newInstructor = await pool.query('INSERT INTO public.instructor (cedula, nombre, direccion, email) VALUES($1, $2, $3, $4) RETURNING *', [cedula, nombre, direccion, email]);
    console.log(newInstructor);
    if(newInstructor){
      res.status(201).json({
      message: 'Instructor Creado',
      data:{
        instructor :newInstructor.rows[0]
      }
    })
    }

      
  } catch (error) {
    httpError(res, error);
  }
}


const updateInstructor = async (req, res) => {
  try {
    const id = req.params.id;
    const { cedula, nombre, direccion, email} = req.body;
    const respuestaSelect =  await pool.query('SELECT * FROM public.instructor where id = $1', [id]);
    if(respuestaSelect.rowCount === 1){
      const respuesta = await pool.query('UPDATE public.instructor SET cedula=$1, nombre=$2, direccion=$3, email=$4 WHERE id = $5', [cedula, nombre, direccion, email, id]);
      console.log(respuesta);
      res.json({
        message: 'Instructor Update Satisfactoriamente',
        data:{
          instructor :{id, cedula, nombre, direccion, email}
        }
      })
     }else{
      res.status(404).send({mesagge: 'El recurso solicitado no existe'}); 
    }  
  } catch (error) {
     httpError(res, error);
  }
  
    

}

const deleteInstructorById = async (req, res) => {
  
  try {
    const id = req.params.id;
    const respuestaSelect =  await pool.query('SELECT * FROM public.instructor where id = $1', [id]);
    if(respuestaSelect.rowCount === 1){
      const respuesta =  await pool.query('DELETE FROM public.instructor where id = $1', [id]);
      console.log(respuesta)
      res.send(`Instructor con id: ${id} eliminado satisfactoriamente`);
    }else{
      res.status(404).send({mesagge: 'El recurso solicitado no existe'}); 
    }  
  } catch (error) {
    httpError(res, error);
  }
  
}

module.exports = {
  getInstructores,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructorById
}