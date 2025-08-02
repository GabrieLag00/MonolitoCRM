# Usar la imagen oficial de MySQL
FROM mysql:8.0

# Variables de entorno para MySQL
ENV MYSQL_DATABASE=contactform
ENV MYSQL_USER=efra_user
ENV MYSQL_PASSWORD=efra_password_123
ENV MYSQL_ROOT_PASSWORD=root_password_123

# Crear directorio de logs
RUN mkdir -p /var/log/mysql && chown mysql:mysql /var/log/mysql

# Copiar el script de inicialización
COPY init.sql /docker-entrypoint-initdb.d/

# Copiar configuración personalizada
COPY my.cnf /etc/mysql/conf.d/

# Exponer el puerto 3306
EXPOSE 3306
