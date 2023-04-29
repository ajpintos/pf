require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
    DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
} = process.env;
console.log(DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
const sequelize = new Sequelize(`mariadb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)));
    });

// Inyectamos la conexión (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { Users, Products, Categories, Ratings, Favorites, Orders, OrdersDetails, Payments, Deliveries } = sequelize.models;

// // Aca vendrían las relaciones

Users.belongsToMany(Orders, {through: "usersOrders"});
Orders.hasOne(Users);

Users.belongsToMany(Ratings, {through: "usersRatings"});
Ratings.belongsToMany(Users, {through: "usersRatings"});

// Users.belongsToMany(Favorites, {through: "usersFavorites"});
// Favorites.belongsToMany(Users, {through: "usersFavorites"});
Users.hasOne(Favorites);
Favorites.belongsTo(Users);


Products.belongsToMany(Ratings, {through: "productsRatings"});
Ratings.belongsToMany(Products, {through: "productsRatings"});

Products.belongsToMany(Categories, {through: "productsCategories"});
Categories.belongsToMany(Products, {through: "productsCategories"});

// Products.belongsToMany(Favorites, {through: "productsFavorites"});
// Favorites.belongsToMany(Products, {through: "productsFavorites"});
Products.hasOne(Favorites);
Favorites.belongsTo(Products);


Products.belongsToMany(OrdersDetails, {through: "productsOrdersDetails"});
OrdersDetails.belongsToMany(Products, {through: "productsOrdersDetails"});

Orders.hasOne(OrdersDetails);
OrdersDetails.hasOne(Orders);

Orders.hasOne(Deliveries);
Deliveries.belongsToMany(Orders, {through: "ordersDeliveries"});

OrdersDetails.hasOne(Deliveries);
Deliveries.belongsToMany(OrdersDetails, {through: "ordersDetails.Deliveries"});

Orders.hasOne(Payments);
Payments.belongsToMany(Orders, {through: "ordersPayments"});

OrdersDetails.hasOne(Payments);
Payments.belongsToMany(OrdersDetails, {through: "ordersDetailsPayments"});


// Product.hasMany(Reviews);

module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize,     // para importar la conexión { conn } = require('./db.js');
};
