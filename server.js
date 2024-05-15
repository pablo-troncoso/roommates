const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Express Static para carpeta 'public'
app.use(express.static('public'));

// Ruta Obtener los gastos almacenados
app.get('/gastos', (req, res) => {
  fs.readFile('gastos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de gastos');
    } else {
      const gastos = JSON.parse(data);
      res.status(200).json(gastos);
    }
  });
});

// Ruta Almacenar Nuevo gasto
app.post('/gasto', (req, res) => {
  const nuevoGasto = req.body;
  fs.readFile('gastos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de gastos');
    } else {
      const gastos = JSON.parse(data);
      gastos.push(nuevoGasto);
      const gastosActualizados = JSON.stringify(gastos, null, 2);
      fs.writeFile('gastos.json', gastosActualizados, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al escribir en el archivo de gastos');
        } else {
          res.status(201).send('Gasto agregado correctamente');
        }
      });
    }
  });
});

// Ruta Modificar Gasto existente
app.put('/gasto/:id', (req, res) => {
  const gastoId = req.params.id;
  const nuevoGasto = req.body;
  fs.readFile('gastos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de gastos');
    } else {
      let gastos = JSON.parse(data);
      const indice = gastos.findIndex(gasto => gasto.id === gastoId);
      if (indice !== -1) {
        gastos[indice] = nuevoGasto;
        const gastosActualizados = JSON.stringify(gastos, null, 2);
        fs.writeFile('gastos.json', gastosActualizados, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al escribir en el archivo de gastos');
          } else {
            res.status(200).send('Gasto actualizado correctamente');
          }
        });
      } else {
        res.status(404).send('Gasto no encontrado');
      }
    }
  });
});

// Ruta Eliminar un gasto
app.delete('/gasto/:id', (req, res) => {
  const gastoId = req.params.id;
  fs.readFile('gastos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de gastos');
    } else {
      let gastos = JSON.parse(data);
      const indice = gastos.findIndex(gasto => gasto.id === gastoId);
      if (indice !== -1) {
        gastos.splice(indice, 1);
        const gastosActualizados = JSON.stringify(gastos, null, 2);
        fs.writeFile('gastos.json', gastosActualizados, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al escribir en el archivo de gastos');
          } else {
            res.status(200).send('Gasto eliminado correctamente');
          }
        });
      } else {
        res.status(404).send('Gasto no encontrado');
      }
    }
  });
});

// Ruta Obtener todos los roommates almacenados
app.get('/roommates', (req, res) => {
  fs.readFile('roommates.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de roommates');
    } else {
      const roommates = JSON.parse(data);
      res.status(200).json(roommates);
    }
  });
});

// Ruta para manejar todas las demás rutas y redirigirlas a index.html
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
