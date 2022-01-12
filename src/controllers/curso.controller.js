const { pool } = require('../database/db');
const { httpError } = require('../helpers/handleError');



const getCursos = async (req, res) => {
  try {
     const respuesta =  await pool.query('SELECT * FROM public.cursos');
    res.status(200).send(respuesta.rows);
  } catch (error) {
     httpError(res, error);
  }
 
}

const getCursosById = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta =  await pool.query('SELECT * FROM public.cursos where id = $1', [id]);
    res.status(200).send(respuesta.rows);
  } catch (error) {
    httpError(res, error);
  }
}

const createCurso = async (req, res) => {
  console.log(req.body);
  const { descripcion, id_horario, id_instructor} = req.body;
  try {
    const respuestaSelectHorario =  await pool.query('SELECT * FROM public.horarios where id=$1 ', [id_horario]);

    console.log(respuestaSelectHorario.rowCount);
    if(respuestaSelectHorario.rowCount !== 0){
      const respuestaSelectInstructor =  await pool.query('SELECT * FROM public.instructor where id = $1', [id_instructor]);
      console.log(respuestaSelectInstructor.rowCount);
      if(respuestaSelectInstructor.rowCount !== 0){
        const respuestaSelect =  await pool.query('SELECT * FROM public.cursos where id_horario =$1 and id_instructor= $2', [id_horario, id_instructor]);
        if(respuestaSelect.rowCount === 0){
          const newCurso = await pool.query('INSERT INTO public.cursos (descripcion, id_horario, id_instructor) VALUES($1, $2, $3) RETURNING *', [descripcion, id_horario, id_instructor]);
          console.log(newCurso);
          if(newCurso){
            res.status(201).json({
              message: 'Curso Creado Satisfactoriamente',
                data:{
                curso :newCurso.rows[0]
                }
            })  
          }
        }else{
          res.status(422).send({message: 'El instructor ya tiene un curso asignado en ese horario'});
        }
      }else{
        res.status(404).send({message: 'El Instructor no existe'});
      }
    }else{
      res.status(404).send({message: 'El Horario no existe'});
    } 
  } catch (error) {
    httpError(res, error);
  }
  
}
const updateCurso = async (req, res) => {
  try {
    const {id} = req.params;
    const { descripcion, id_horario, id_instructor} = req.body;
    const respuestaSelect =  await pool.query('SELECT * FROM public.cursos where id = $1', [id]);
    console.log(respuestaSelect.rowCount);
    if(respuestaSelect.rowCount !== 0){
      const respuestaSelectHorario =  await pool.query('SELECT * FROM public.horarios where id=$1 ', [id_horario]);
      console.log(respuestaSelectHorario.rowCount);
      if(respuestaSelectHorario.rowCount !== 0){
        const respuestaSelectInstructor =  await pool.query('SELECT * FROM public.instructor where id = $1', [id_instructor]);
        console.log(respuestaSelectInstructor.rowCount);
        if(respuestaSelectInstructor.rowCount !== 0){
          const respuesta = await pool.query('UPDATE public.cursos SET descripcion=$1, id_horario=$2, id_instructor=$3 WHERE id = $4', [descripcion, id_horario, id_instructor, id]);
            console.log(respuesta);
            res.json({
              message: 'Curso Update Satisfactoriamente',
              data:{
                curso :{id, descripcion, id_horario, id_instructor}
              }
            })      
        }else{
          res.status(404).send({message: 'El Instructor no existe'});
        }
      }else{
        res.status(404).send({message: 'El Horario no existe'});
      }    
    }else{
      res.status(404).send({message: 'El Curso no existe'});
    }  
  } catch (error) {
    httpError(res, error);
  }

  
}

const deleteCursoById = async (req, res) => {
  try {
    const {id} = req.params;
    const respuestaSelect =  await pool.query('SELECT * FROM public.cursos where id = $1', [id]);
    console.log(respuestaSelect.rowCount);
    if(respuestaSelect.rowCount !== 0){
      const respuestaSelectCursoAlumnos =  await pool.query('SELECT * FROM public.cursos_alumnos where id_curso = $1', [id]);
      console.log(respuestaSelectCursoAlumnos.rowCount);
      if(respuestaSelectCursoAlumnos.rowCount === 0){
        const respuesta =  await pool.query('DELETE FROM public.cursos WHERE id= $1', [id]);
        console.log(respuesta)
        res.send({
          message:`Curso con id: ${id} eliminado satisfactoriamente`
        });
      }else{
        res.status(422).send({message: 'El Curso no se puede eliminar, ya que tienes alumnos asociados'});  
      }
      
    }else{
      res.status(404).send({message: 'El Curso no existe'});
    }


    
  
  } catch (error) {
    httpError(res, error);
  }
  
}

const getCursosByDia = async (req, res) => {
  try {
    const {id_dia} = req.params;
    const respuestaSelectDia =  await pool.query('SELECT * FROM public.dias where id = $1', [id_dia]);
    console.log(respuestaSelectDia.rowCount);
    if(respuestaSelectDia.rowCount !== 0){
      const respuestaSelect =  await pool.query('select * from cursos as c, horarios as h, dias as d where c.id_horario = h.id and h.id_dia = d.id and d.id = $1', [id_dia]);
      res.status(200).send(respuestaSelect.rows);

    }else{
      res.status(404).send({message: 'El Dia no existe'});
    }

  } catch (error) {
    httpError(res, error);
  }
}

const inscribirCursoAlumno = async (req, res) => {
  const { id_curso, id_alumno} = req.body;
  const respuestaSelectCurso =  await pool.query('SELECT * FROM public.cursos where id = $1', [id_curso]);
  console.log(respuestaSelectCurso.rowCount);
  if(respuestaSelectCurso.rowCount !== 0){
    const respuestaSelectAlumno =  await pool.query('SELECT * FROM public.alumnos where id = $1', [id_alumno]);
    console.log(respuestaSelectAlumno.rowCount);
    if(respuestaSelectAlumno.rowCount !== 0){
      const respuestaSelectCursoAlumno =  await pool.query('SELECT id, id_curso, id_alumno FROM public.cursos_alumnos where id_curso=$1 and id_alumno = $2;', [id_curso ,id_alumno]);
      console.log(respuestaSelectCursoAlumno.rowCount);
      if(respuestaSelectCursoAlumno.rowCount === 0){
       const newInscripcion = await pool.query('INSERT INTO public.cursos_alumnos (id_curso, id_alumno) VALUES($1, $2) RETURNING *', [id_curso, id_alumno]);
          console.log(newInscripcion);
          if(newInscripcion){
            res.status(201).json({
              message: 'Alumno inscrito Satisfactoriamente',
                data:{
                  cursoAlumno :newInscripcion.rows[0]
                }
            })
          }  
      }else{
        res.status(422).send({message: 'El Alumno ya esta inscrito en ese curso'});  
      }
    }else{
      res.status(404).send({message: 'El Alumno no existe'});
    }
  }else{
    res.status(404).send({message: 'El Curso no existe'});
  }

}

module.exports = {
  getCursos,
  getCursosById,
  createCurso,
  updateCurso,
  deleteCursoById,
  getCursosByDia,
  inscribirCursoAlumno
}