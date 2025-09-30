# backendTIF
Repositorio que contendrá la estructura del backend para el trabajo final integrador de Programación III - TUDW - 2025

Los integrantes del grupo son:
-Cabrera Tobías
-Merele Maximiliano
-Perero Martin
-Vilaboa Agustin

###Consideraciones importantes###
Para crear y conectar la base de datos deben seguir las siguientes instrucciones:
Instalar y configurar MySQL
Recuerden que deben configurar usuario y contraseña, no ROOT.
Lo mas sencillo es usar mysql en la consola (yo lo usé directamente)
crean la base de datos, le dan a USE e ingresan el script. (Los scripts estan en el campus)
Configurar variables de entorno
Copiá el archivo .env.example y renombralo como .env:

en la terminal lo modificas con el siguiente script, o directamente en VSC:
cp .env.example .env
Editá el archivo .env y completá tus credenciales de base de datos:

env
DB_HOST=localhost
DB_USER=root               
DB_PASS=tu_contraseña
DB_NAME=reservas

#Mi configuracion es la siguiente, por si necesitamos tener la misma todos (no creo que sea necesario, ya que este es un entorno virtual de cada uno, y la conexion a la base de datos desde el archivo js es "generica")

DB_HOST=localhost
DB_USER=maxi_salones
DB_PASS=Tudw_2025!
DB_NAME=salonesBD

#Metodos y consultas creados. Ejemplos y respuestas esperadas.

inactivos: si está presente, devuelve salones con activo = 0. Si no se incluye, devuelve los activos (activo = 1).

page: número de página para paginación. Por defecto: 1.

limit: cantidad de resultados por página. Por defecto: 10.

ordenar: campo por el cual ordenar los resultados. Valores válidos: titulo, importe, capacidad, salon_id.

desc: si está presente, ordena en forma descendente.

Obtener todos los salones activos
GET /salones

Obtener salones inactivos
GET /salones?inactivos

Paginación
GET /salones?page=2&limit=5

Ordenar por título ascendente
GET /salones?ordenar=titulo

Ordenar por capacidad descendente
GET /salones?ordenar=capacidad&desc

Ordenar por ID descendente
GET /salones?ordenar=salon_id&desc

Combinación de filtros
GET /salones?inactivos&page=1&limit=10&ordenar=importe&desc

Metodo GET por ID:
GET /salones/:id
Si no existe el ID, devuelve mensaje de error.
Si existe, devuelve el salon correspondiente con un mensaje (activo, o inactivo)

Metodo PUT/salones7:id
Edita los siguientes campos:
{
  "titulo": "Sala Norte",
  "direccion": "Planta Alta",
  "capacidad": 40,
  "importe": 1500,
  "activo": 1
}
