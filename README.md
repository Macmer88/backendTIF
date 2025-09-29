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

#probando si la rama se blindó crrectamente#