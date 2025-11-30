FROM python:3.11-slim

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias del sistema necesarias para Gunicorn (mínimas)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos del proyecto
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Exponer el puerto 8000 (el que usa Gunicorn)
EXPOSE 8000

# Comando para ejecutar la app en producción
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app", "--workers=3"]
