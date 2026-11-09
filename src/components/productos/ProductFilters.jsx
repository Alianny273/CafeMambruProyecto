import { categorias, rangosPrecio } from '../../data/productos'

export default function ProductFilters({ categoria, setCategoria, precioMax, setPrecioMax }) {
  return (
    <div className="filters">
      <div className="filters-group" role="group" aria-label="Filtrar por categoría">
        {categorias.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip ${categoria === c.id ? 'active' : ''}`}
            aria-pressed={categoria === c.id}
            onClick={() => setCategoria(c.id)}
          >
            {c.etiqueta}
          </button>
        ))}
      </div>

      <label className="filters-price">
        Precio
        <select value={precioMax} onChange={(e) => setPrecioMax(e.target.value)}>
          {rangosPrecio.map((r) => (
            <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
