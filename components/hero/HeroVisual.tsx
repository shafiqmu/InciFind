export default function HeroVisual() {
  return (
    <section className="hero-visual" aria-hidden="true">
      <div className="hero-glow"></div>

      <div className="leaf leaf-1"></div>
      <div className="leaf leaf-2"></div>
      <div className="leaf leaf-3"></div>

      <div className="glass-bubble bubble-1"></div>
      <div className="glass-bubble bubble-2"></div>
      <div className="glass-bubble bubble-3"></div>

      <div className="lab-glass">
        <div className="water"></div>
        <div className="stem"></div>
      </div>

      <div className="serum-bottle">
        <div className="dropper">
          <div className="dropper-top"></div>
          <div className="dropper-neck"></div>
        </div>

        <div className="bottle-body">
          <div className="bottle-label">
            <span>SKIN</span>
            <strong>FORMULA</strong>
          </div>
        </div>
      </div>

      <div className="cream-jar">
        <div className="jar-lid"></div>
        <div className="jar-body">
          <div className="jar-label">
            <span>DAILY</span>
            <strong>CREAM</strong>
          </div>
        </div>
      </div>

      <div className="cream-swatch">
        <div></div>
      </div>
    </section>
  );
}
