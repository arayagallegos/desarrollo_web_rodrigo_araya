from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from models import db



app = Flask(__name__)
app.secret_key = 'secreto123'

# Config
app.config.from_pyfile("config.py")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# DB
db.init_app(app)

# Importa modelos
from models import *

from flask import jsonify

@app.route('/actividad/<int:id>')
def actividad_detalle(id):
    actividad = Actividad.query.get_or_404(id)
    return render_template('actividad_detalle.html', actividad=actividad)


# Ruta raíz
@app.route("/")
def portada():
    actividades = Actividad.query.order_by(Actividad.id.desc()).limit(5).all()
    return render_template("portada.html", actividades=actividades)

@app.route("/formulario")
def formulario():
    regiones = Region.query.all()
    return render_template("formulario.html", regiones=regiones)

@app.route("/listado")
def listado():
    pagina = request.args.get('pagina', 1, type=int)
    por_pagina = 5

    actividades = Actividad.query.order_by(Actividad.dia_hora_inicio.desc()).paginate(page=pagina, per_page=por_pagina, error_out=False)
    return render_template("listado.html", actividades=actividades.items, pagina=pagina, paginas= actividades.pages)

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/api/comunas")
def comunas():
    region_id = request.args.get("region")
    comunas = Comuna.query.filter_by(region_id=region_id).order_by(Comuna.nombre).all()
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])


@app.route("/agregar", methods=["POST"])
def agregar():
    try:
        # Obtener datos del formulario
        region_id = request.form["region"]
        comuna_id = request.form["comuna"]
        sector = request.form.get("sector")
        nombre = request.form["nombre"]
        email = request.form["email"]
        celular = request.form.get("celular")
        descripcion = request.form["descripcion"]

        # Fechas
        inicio_str = request.form["inicio"]
        termino_str = request.form.get("termino")

        inicio = datetime.strptime(inicio_str, "%Y-%m-%dT%H:%M")
        termino = datetime.strptime(termino_str, "%Y-%m-%dT%H:%M") if termino_str else None

        # Crear actividad
        nueva = Actividad(
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            descripcion=descripcion,
            dia_hora_inicio=inicio,
            dia_hora_termino=termino
        )
        db.session.add(nueva)
        db.session.commit()

        # Guardar tema
        # Guardar múltiples temas
        temas = request.form.getlist("tema")
        for tema in temas:
            glosa_otro = request.form.get("glosa_otro") if tema == "otro" else None
            nuevo_tema = ActividadTema(tema=tema, glosa_otro=glosa_otro, actividad_id=nueva.id)
            db.session.add(nuevo_tema)

        # Contactos múltiples
        contactos = request.form.getlist("contactar_por")
        for contacto in contactos:
            identificador = request.form.get(f"contacto-{contacto}")
            if identificador:
                c = ContactarPor(nombre=contacto, identificador=identificador, actividad_id=nueva.id)
                db.session.add(c)

        # Manejo de fotos
        files = request.files.getlist("foto")
        for f in files:
            if f.filename:
                filename = secure_filename(f.filename)
                ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                f.save(ruta)
                ruta_relativa = f"uploads/{filename}".replace("\\", "/")
                nueva_foto = Foto(nombre_archivo=filename, ruta_archivo=ruta_relativa, actividad_id=nueva.id)
                db.session.add(nueva_foto)

        db.session.commit()
        flash("Actividad agregada exitosamente", "success")
        return redirect(url_for("portada"))

    except Exception as e:
        db.session.rollback()
        flash(f"Error al agregar: {e}", "error")
        return redirect(url_for("formulario"))

if __name__ == '__main__':
    app.run(debug=True)
