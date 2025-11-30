from flask import Blueprint, render_template, request, jsonify, current_app, send_file
import csv
import io

from .logic import calcular_presion, calcular_altura_manometro, agregar_lectura, limpiar_lecturas

bp = Blueprint("main", __name__)

@bp.route("/")
def index():
    return render_template("index.html")

@bp.route("/compute", methods=["POST"])
def compute():
    data = request.get_json()

    rho = float(data["rho"])
    g = float(data["g"])
    h = float(data["h"])
    rho_m = float(data["rho_m"])

    P = calcular_presion(rho, g, h)
    h_man = calcular_altura_manometro(P, rho_m, g)

    return jsonify({
        "P": P,
        "h_man": h_man
    })

@bp.route("/record", methods=["POST"])
def record():
    data = request.get_json()
    h = float(data["h"])
    P = float(data["P"])

    lecturas = agregar_lectura(current_app.config, h, P)
    return jsonify({"lecturas": lecturas})

@bp.route("/clear", methods=["POST"])
def clear():
    limpiar_lecturas(current_app.config)
    return jsonify({"ok": True})

@bp.route("/download")
def download():
    lecturas = current_app.config["lecturas"]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["h (m)", "P (Pa)"])
    writer.writerows(lecturas)

    output.seek(0)

    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype="text/csv",
        as_attachment=True,
        download_name="lecturas.csv"
    )
