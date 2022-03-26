const express = require ('express'); //importar dependecia express
const mysql = require ('mysql'); //importar dependecia mysql para conectar BD

const bodyParser = require('body-parser');//importar dependencia bodyparser

const PORT = process.env.PORT || 3050 // Llamar a nuestro puerto 3050

const app = express(); // Obteniendo instancia express

app.use(bodyParser.json());// dar permiso a express para leer el cuerpo y luego analizarlo a un Json que se pueda entender

//Configuracion MYSQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database:'productos'
});


//Rutas
app.get('/', (req, res) =>{
    res.send('Bienvenido a mi Api');
})

// todos  productos

app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos'; //  creamos la constante sql que se iguala a la sentencia de MySql para llamar la lista de productos
    
    connection.query(sql, (error, results) => { //funcion para que mande los resultados o lance un mensaje de no resultados  
        if (error) throw error;
        if (results.length > 0){
            res.json(results);          
        }else {
            res.send('Not result');
        }
    })
});

app.get('/productos/:id', (req, res) => {

    const {id } = req.params //detructuramos
    const sql = `SELECT * FROM productos WHERE id = ${id}`; 

    connection.query(sql, (error, results) => { //funcion para que mande los resultados o lance un mensaje de no resultados  
        if (error) throw error;
        if (results.length > 0){
            res.json(results);
        }else {
            res.send('Not result');
        }
    })
});


app.post('/add', (req, res) => {
    const sql = 'INSERT INTO productos SET ?';

    const productoObj ={ // se crea un obejto
        marca: req.body.marca, // lectura
        nombre: req.body.nombre,
        precio: req.body.precio
    };

    connection.query(sql, productoObj, error =>{ //funcion para validar el agregado del objeto 
        if(error) throw error;
        res.send('Producto creado');
    });

});

app.put('/update/:id', (req, res) => {
    const {id } = req.params;// destruturamos
    const {marca, nombre, precio} = req.body; //lectura
    const sql =`UPDATE productos SET marca = '${marca}', nombre = '${nombre}, precio = '${precio}' WHERE id = ${id} `;

    connection.query(sql, error =>{
        if(error) throw error;
        res.send('Producto actualizado');
    });
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params; //destructuramos
    const sql = `DELETE FROM productos WHERE id =${id}`;

    connection.query(sql, error =>{
        if(error) throw error;
        res.send('Producto Eliminado');
    });
});

//Validamos conexion
connection.connect(error => {
    if(error) throw error;
    console.log('Database server running')
});


app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))