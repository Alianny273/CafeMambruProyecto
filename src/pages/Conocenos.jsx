import About from '../components/nosotros/About'

export default function Conocenos() {
  return (
    <>
      <title>Conócenos - Mambrú</title>
      <About
        claseExtra="about-us--page"
        parrafoFinal="Somos una marca joven y parchada, pero con un respeto absoluto por el café de especialidad. Sin rodeos, puro sabor."
        to="/productos"
        textoBoton="Prueba nuestra historia"
      />
    </>
  )
}
