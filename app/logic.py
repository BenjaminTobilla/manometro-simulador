import numpy as np

def calcular_presion(rho, g, h):
    return rho * g * h

def calcular_altura_manometro(P, rho_m, g):
    return P / (rho_m * g)

def agregar_lectura(config, h, P):
    config["lecturas"].append((h, P))
    return config["lecturas"]

def limpiar_lecturas(config):
    config["lecturas"].clear()
    return []
