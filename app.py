from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from models import db
import re
from sqlalchemy import func

app = Flask(__name__)
app.secret_key = 'secreto123'

# Config
app.config.from_pyfile("config.py")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# DB
db.init_app(app)

# Flask-Migrate
migrate = Migrate(app, db)

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
    errores = []
    datos = request.form

    try:
        #Validaciones
        nombre = datos.get("nombre", "").strip()
        if len(nombre) < 5 or len(nombre) > 200:
            errores.append("El nombre debe tener entre 5 y 200 caracteres.")

        email = datos.get("email", "").strip()
        if len(email) <= 15 or not re.match(r"^[^@]+@[^@]+\.[a-zA-Z]{2,}$", email):
            errores.append("El email no es válido.")

        celular = datos.get("celular", "").strip()
        if celular:
            if not re.match(r"^\+\d{3}\.\d{8}$", celular):
                errores.append("El celular debe tener el formato +NNN.NNNNNNNN")

        region_id = datos.get("region")
        comuna_id = datos.get("comuna")
        if not region_id:
            errores.append("Debe seleccionar una región.")
        if not comuna_id:
            errores.append("Debe seleccionar una comuna.")

        sector = datos.get("sector", "").strip()
        if sector and len(sector) > 100:
            errores.append("El sector no puede superar los 100 caracteres.")

        descripcion = datos.get("descripcion", "").strip()

        inicio_str = datos.get("inicio")
        if not inicio_str:
            errores.append("Debe ingresar una fecha de inicio.")
        else:
            try:
                inicio = datetime.strptime(inicio_str, "%Y-%m-%dT%H:%M")
            except:
                errores.append("Fecha de inicio no válida.")

        termino_str = datos.get("termino")
        termino = None
        if termino_str:
            try:
                termino = datetime.strptime(termino_str, "%Y-%m-%dT%H:%M")
                if inicio and termino <= inicio:
                    errores.append("La fecha de término debe ser posterior al inicio.")
            except:
                errores.append("Fecha de término no válida.")

        temas = request.form.getlist("tema")
        if not temas:
            errores.append("Debe seleccionar al menos un tema.")
        if "otro" in temas:
            glosa_otro = datos.get("glosa_otro", "").strip()
            if len(glosa_otro) < 3 or len(glosa_otro) > 15:
                errores.append("Debe ingresar un tema personalizado entre 3 y 15 caracteres.")
        else:
            glosa_otro = None

        contactos = request.form.getlist("contactar_por")
        if len(contactos) > 5:
            errores.append("Puede seleccionar hasta 5 métodos de contacto.")
        for contacto in contactos:
            identificador = datos.get(f"contacto-{contacto}", "").strip()
            if len(identificador) < 4 or len(identificador) > 50:
                errores.append(f"El identificador para {contacto} debe tener entre 4 y 50 caracteres.")

        files = request.files.getlist("foto")
        files_validos = [f for f in files if f.filename]
        if len(files_validos) < 1 or len(files_validos) > 5:
            errores.append("Debe subir entre 1 y 5 fotos.")
        for f in files_validos:
            if not f.mimetype.startswith("image/"):
                errores.append("Solo se permiten archivos de imagen.")
                break

        if errores:
            regiones = Region.query.all()
            return render_template("formulario.html", errores=errores, regiones=regiones, datos=datos)

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

        for tema in temas:
            t = ActividadTema(tema=tema, glosa_otro=glosa_otro if tema == "otro" else None, actividad_id=nueva.id)
            db.session.add(t)

        for contacto in contactos:
            identificador = datos.get(f"contacto-{contacto}", "").strip()
            db.session.add(ContactarPor(nombre=contacto, identificador=identificador, actividad_id=nueva.id))

        for f in files_validos:
            filename = secure_filename(f.filename)
            ruta = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            f.save(ruta)
            ruta_relativa = f"uploads/{filename}".replace("\\", "/")
            db.session.add(Foto(nombre_archivo=filename, ruta_archivo=ruta_relativa, actividad_id=nueva.id))

        db.session.commit()
        flash("Actividad agregada exitosamente", "success")
        return redirect(url_for("portada"))

    except Exception as e:
        db.session.rollback()
        flash(f"Ocurrió un error inesperado: {e}", "error")
        return redirect(url_for("formulario"))


@app.route("/api/estadisticas/actividades_por_dia")
def actividades_por_dia():
    datos = db.session.query(
        func.date(Actividad.dia_hora_inicio), func.count()
    ).group_by(func.date(Actividad.dia_hora_inicio)).all()
    return jsonify([{ "dia": str(d[0]), "cantidad": d[1] } for d in datos])

@app.route("/api/estadisticas/actividades_por_tipo")
def actividades_por_tipo():
    datos = db.session.query(
        ActividadTema.tema, func.count()
    ).group_by(ActividadTema.tema).all()
    return jsonify([{ "tipo": d[0], "cantidad": d[1] } for d in datos])

@app.route("/api/estadisticas/actividades_por_horario")
def actividades_por_horario():
    datos = db.session.query(Actividad.dia_hora_inicio).all()
    agrupado = {}
    for inicio in [d[0] for d in datos]:
        mes = inicio.strftime("%Y-%m")
        hora = inicio.hour
        if mes not in agrupado:
            agrupado[mes] = {"manana": 0, "mediodia": 0, "tarde": 0}
        if hora < 12:
            agrupado[mes]["manana"] += 1
        elif 12 <= hora < 18:
            agrupado[mes]["mediodia"] += 1
        else:
            agrupado[mes]["tarde"] += 1
    return jsonify([
        {"mes": k, **v} for k, v in sorted(agrupado.items())
    ])

@app.route("/api/actividad/<int:actividad_id>/comentarios", methods=["GET", "POST"])
def comentarios_api(actividad_id):
    if request.method == "GET":
        comentarios = Comentario.query.filter_by(actividad_id=actividad_id).order_by(Comentario.fecha.desc()).all()
        return jsonify([
            {
                "nombre": c.nombre,
                "texto": c.texto,
                "fecha": c.fecha.strftime("%d-%m-%Y %H:%M")
            }
            for c in comentarios
        ])

    if request.method == "POST":
        data = request.get_json() or {}

        nombre = data.get("nombre", "").strip()
        texto = data.get("texto", "").strip()

        # Validaciones de largos
        if not (3 <= len(nombre) <= 80):
            return jsonify({"status": "error", "error": "El nombre debe tener entre 3 y 80 caracteres."}), 400
        if len(texto) < 5 or len(texto) > 300:
            return jsonify({"status": "error", "error": "El comentario debe tener entre 5 y 300 caracteres."}), 400

        # Validación para prevenir etiquetas HTML
        tag_regex = re.compile(r'<[^>]+>')
        if tag_regex.search(nombre) or tag_regex.search(texto):
            return jsonify({"status": "error", "error": "No se permiten etiquetas HTML."}), 400

        # Crear y guardar el comentario
        nuevo_comentario = Comentario(
            nombre=nombre,
            texto=texto,
            fecha=datetime.utcnow(),
            actividad_id=actividad_id
        )
        db.session.add(nuevo_comentario)
        db.session.commit()

        return jsonify({"status": "ok"}), 201

if __name__ == '__main__':
    app.run(debug=True)
