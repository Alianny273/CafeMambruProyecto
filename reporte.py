import pandas as pd
from sqlalchemy import create_engine

# 1. Conexión a tu base de datos local de XAMPP/MySQL ('cafemambru')
# Si tienes contraseña en root, cámbialo por 'mysql+pymysql://root:tu_contraseña@localhost:3306/cafemambru'
engine = create_engine('mysql+pymysql://root:@localhost:3306/cafemambru')

print("Conectando a la base de datos de Café Mambrú...")

# 2. Leer los datos de las tablas usando Pandas (equivalente a leer un CSV o Excel pero directo de la BD)
df_productos = pd.read_sql('SELECT * FROM productos', con=engine)
df_pedidos = pd.read_sql('SELECT * FROM pedidos', con=engine)

# 3. Limpiar, agrupar y calcular métricas con Pandas (como indica la guía del profe)
stock_total = df_productos['stock'].sum()
ventas_totales = df_pedidos['total'].sum()
cantidad_pedidos = len(df_pedidos)

# Encontrar el producto más caro o con mayor precio (ejemplo de idxmax como en la guía)
idx_max_precio = df_productos['precio'].idxmax()
producto_destacado = df_productos.loc[idx_max_precio, 'nombre']
precio_destacado = df_productos.loc[idx_max_precio, 'precio']

# Convertir la tabla de productos a formato HTML con clases de diseño
tabla_html_productos = df_productos[['nombre', 'categoria', 'precio', 'stock']].to_html(
    classes='table-style', index=False, escape=False
)

# 4. Construir la estructura del reporte HTML (Paso 3 de la guía del profe)
contenido_html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Gerencial - Café Mambrú</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #FDFBF7;
            color: #2C221E;
            margin: 0;
            padding: 40px;
        }}
        h1 {{
            color: #2C5545;
            margin-bottom: 5px;
        }}
        .subtitle {{
            color: #78716C;
            font-size: 0.95rem;
            margin-bottom: 30px;
        }}
        .kpi-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }}
        .card {{
            background: #FFFFFF;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #EAE0D5;
        }}
        .card h3 {{
            margin: 0 0 10px 0;
            font-size: 0.85rem;
            color: #78716C;
            text-transform: uppercase;
        }}
        .card .value {{
            font-size: 1.8rem;
            font-weight: bold;
            color: #2C5545;
        }}
        .card .value.accent {{
            color: #E2725B;
        }}
        h2 {{
            color: #2C5545;
            border-bottom: 2px solid #EAE0D5;
            padding-bottom: 8px;
            margin-top: 30px;
        }}
        /* Estilos para la tabla generada por Pandas */
        table.table-style {{
            width: 100%;
            border-collapse: collapse;
            background: #FFFFFF;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #EAE0D5;
        }}
        table.table-style th {{
            background-color: #2C5545;
            color: #FFFFFF;
            padding: 12px 15px;
            text-align: left;
            font-size: 0.9rem;
        }}
        table.table-style td {{
            padding: 12px 15px;
            border-bottom: 1px solid #EAE0D5;
            font-size: 0.9rem;
        }}
        table.table-style tr:hover {{
            background-color: #FDFBF7;
        }}
    </style>
</head>
<body>

    <h1>Café Mambrú - Reporte del Sistema</h1>
    <p class="subtitle">Generado automáticamente mediante Python, Pandas y conexión a Base de Datos MySQL.</p>

    <!-- Tarjetas de KPIs (Indicadores clave) -->
    <div class="kpi-grid">
        <div class="card">
            <h3>Ventas Totales Registradas</h3>
            <div class="value">${ventas_totales:,.2f} COP</div>
        </div>
        <div class="card">
            <h3>Total de Pedidos</h3>
            <div class="value accent">{cantidad_pedidos}</div>
        </div>
        <div class="card">
            <h3>Stock Total en Tienda</h3>
            <div class="value">{stock_total} u.</div>
        </div>
        <div class="card">
            <h3>Producto Destacado</h3>
            <div class="value" style="font-size: 1.2rem; margin-top: 5px;">{producto_destacado}</div>
        </div>
    </div>

    <h2>Inventario Actual de Productos</h2>
    {tabla_html_productos}

</body>
</html>
"""

# 5. Guardar el contenido en un archivo HTML (Paso final de la guía del profe)
with open("reporte_mambru.html", "w", encoding="utf-8") as archivo:
    archivo.write(contenido_html)

print("¡Éxito! El archivo 'reporte_mambru.html' ha sido generado correctamente.")