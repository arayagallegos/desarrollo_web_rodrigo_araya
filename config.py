import os

DB_USER = "cc5002"
DB_PASS = "programacionweb"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "tarea2"

UPLOAD_FOLDER = os.path.join('static', 'uploads')
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
