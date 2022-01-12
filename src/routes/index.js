const { Router } = require('express');
const router = Router();

const { getAlumnos, createAlumno, getAlumnoById, deleteAlumnoById, updateAlumno } = require('../controllers/index.controller');
 
const { getInstructores, getInstructorById, createInstructor, updateInstructor, deleteInstructorById } = require('../controllers/instructor.controller');

const { getCursos, getCursosById, createCurso, updateCurso, deleteCursoById, getCursosByDia, inscribirCursoAlumno } = require('../controllers/curso.controller');

const { validateCreate } = require('../validators/alumnos');
const { validateCreateUpdate } = require('../validators/instructor');
const { validateCreateUpdateCurso, validateInscribir } = require('../validators/curso');


//routes alumnos
router.get('/alumnos', getAlumnos);
router.get('/alumnos/:id', getAlumnoById);
router.post('/alumnos', validateCreate, createAlumno);
router.put('/alumnos/:id', validateCreate, updateAlumno);
router.delete('/alumnos/:id', deleteAlumnoById);

//routes instructores
router.get('/instructores', getInstructores);
router.get('/instructores/:id', getInstructorById);
router.post('/instructores', validateCreateUpdate, createInstructor);
router.put('/instructores/:id', validateCreateUpdate, updateInstructor);
router.delete('/instructores/:id', deleteInstructorById);

//routes instructores
router.get('/cursos', getCursos);
router.get('/cursos/:id', getCursosById);
router.post('/cursos', validateCreateUpdateCurso, createCurso);
router.put('/cursos/:id', validateCreateUpdateCurso, updateCurso);
router.delete('/cursos/:id', deleteCursoById);
router.get('/cursos/dia/:id_dia', getCursosByDia);
router.post('/cursos/inscribir', validateInscribir, inscribirCursoAlumno);



module.exports = router;