const app = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
    app.listen(3001, () => {
        console.log('Servidor corriendo en el puerto 3001');
    });
});