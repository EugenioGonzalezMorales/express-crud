/*modules*/
//importando path para la compatibilidad ("/"" y "\"") con windows y linux
const path = require("path");
//importando express
const express = require("express");
const app = express();
//Importando morgan morgan para recibbir en consola informacion de las peticiones del cliente
const morgan = require("morgan");
const mongoose = require("mongoose");

/*Conecting to DB */
mongoose
	.connect(
		"mongodb+srv://eugenio:eugenio@cluster0.7soz6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{
			useCreateIndex: true,
			useNewUrlParser: true,
		}
	)
	.then((db) => console.log("DB conectada"))
	.catch((err) => console.log(err));
/*importing routes*/
const indexRoutes = require("./routes/index");
const webActionsRoutes = require("./routes/web_tools");

/*settings*/
app.set("port", process.env.PORT || 27017);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");

/*middlewares*/
app.use(morgan("dev"));
//Entender los datos que envia un formulario con un modulo de express -- extended false es para solo texto
app.use(express.urlencoded({ extended: false }));

/*routes*/
//Establecer como el controlador de rutas a index.js de routes
app.use("/", indexRoutes);
app.use("/webtools", webActionsRoutes);

/*starting the server*/
app.listen(app.get("port"), () => {
	console.log(`servidor en el puerto ${app.get("port")}`);
});
