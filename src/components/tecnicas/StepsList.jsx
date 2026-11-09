// Lista numerada de pasos (la usan la receta del inicio y la guía de técnicas)
export default function StepsList({ pasos }) {
  return (
    <ul className="steps">
      {pasos.map((paso, i) => (
        <li key={i}>
          <span className="step-num">{String(i + 1).padStart(2, '0')}</span> {paso}
        </li>
      ))}
    </ul>
  )
}
