Hola!!
Para ejecutar la tarea hay que darle a  "mvn spring-boot:run" (tuve que instalar maven) y entrar a http://localhost:8080/
Me faltó arreglar una de las columnas de la tabla, la de "tema", ya que esa venía de otra tabla y no la
actividades, por lo que aparece el nombre repetido. Pensé que era un detalle, así que no le di importancia.
Usé Spring Boot Initializer pero tuve un error con la versión de java, y tuve que bajarla a la 23 porque
me estaba dando errores que no pude solucionar de otra forma.

Usé las credenciales que había creado en las tareas anteriores para unir las bbdd. Esto tenía en la tarea 3:
DB_USER = "cc5002"
DB_PASS = "programacionweb"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "tarea2"

y con eso hice lo de application.properties:
spring.application.name=tarea4

spring.datasource.url=jdbc:mysql://localhost:3306/tarea2
spring.datasource.username=cc5002
spring.datasource.password=programacionweb
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

Creo que no tengo nada más que agregar