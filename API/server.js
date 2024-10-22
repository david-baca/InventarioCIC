const app = require('./app');
require('dotenv').config();
const PORT_API = process.env.PORT_API || 3720;
app.listen(PORT_API, () => {
    console.log(`Servidor corriendo en el puerto ${PORT_API}`);
});